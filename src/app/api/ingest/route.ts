import { NextRequest, NextResponse } from 'next/server'
import { createAnthropicClient } from '@/lib/anthropic'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

const VALID_QUESTION_TYPES = ['mcq', 'short_answer', 'structured', 'extended'] as const
type QuestionType = (typeof VALID_QUESTION_TYPES)[number]

interface AIQuestion {
  content_text: string
  difficulty: number
  question_type: QuestionType
  marks: number
  subtopic_ref: string
}

export async function POST(request: NextRequest) {
  const apiKey = process.env['ANTHROPIC_API_KEY']
  const keyPreview = apiKey ? apiKey.slice(0, 10) + '…' : 'MISSING'
  console.log('[ingest] ANTHROPIC_API_KEY preview:', keyPreview)

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const exam_board_id = formData.get('exam_board_id') as string | null
    const subtopic_id = formData.get('subtopic_id') as string | null

    if (!file || !exam_board_id || !subtopic_id) {
      return NextResponse.json(
        { error: 'Missing required fields: file, exam_board_id, subtopic_id' },
        { status: 400 },
      )
    }

    const isMixed = subtopic_id === 'mixed'

    const fileName = file.name.toLowerCase()
    const isPDF = fileName.endsWith('.pdf')
    const isDOCX = fileName.endsWith('.docx')

    if (!isPDF && !isDOCX) {
      return NextResponse.json(
        { error: 'Only PDF (.pdf) and Word (.docx) files are supported' },
        { status: 400 },
      )
    }

    // ── Text extraction ──────────────────────────────────────────────────────
    const buffer = Buffer.from(await file.arrayBuffer())
    let text = ''

    if (isPDF) {
      // pdf-parse is a CommonJS module (module.exports = fn), so .default may be undefined
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string }>
      const result = await pdfParse(buffer)
      text = result.text
    } else {
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    }

    if (!text.trim()) {
      return NextResponse.json(
        { error: 'Could not extract any text from the uploaded file' },
        { status: 422 },
      )
    }

    // ── Fetch subtopic + topic for context (skipped for mixed) ──────────────
    const supabase = createAdminClient()

    let subtopic: { ref: string; name: string; topic_id: string } | null = null
    let topic: { ref: string; name: string } | null = null

    if (!isMixed) {
      const { data: s } = await supabase
        .from('subtopics')
        .select('ref, title, topic_id')
        .eq('id', subtopic_id)
        .single()
      subtopic = s

      if (subtopic) {
        const { data: t } = await supabase
          .from('topics')
          .select('ref, name')
          .eq('id', subtopic.topic_id)
          .single()
        topic = t
      }
    }

    // ── Anthropic extraction ─────────────────────────────────────────────────
    const anthropic = createAnthropicClient()

    const systemPrompt = `You are an expert Cambridge IGCSE Mathematics (0580) question extractor.
Your sole job is to extract every individual exam question from the provided document text.

Return ONLY a valid JSON array where each element has exactly these keys:
  "content_text"  – string: the complete question including all sub-parts (a), (b), (c) etc.
  "difficulty"    – integer 1–5:
                      1 = single-step recall
                      2 = routine multi-step
                      3 = moderate application / unfamiliar context
                      4 = challenging reasoning or proof
                      5 = extended problem solving / investigation
  "question_type" – string, exactly one of: "mcq" | "short_answer" | "structured" | "extended"
  "marks"         – integer: estimated total mark allocation for this question
  "subtopic_ref"  – string: closest Cambridge 0580 subtopic reference e.g. "1.1", "2.3", "6.4"

Rules:
• Each numbered question (including all its lettered sub-parts) is ONE array element.
• Never split sub-parts into separate objects.
• Output ONLY the JSON array — no markdown fences, no explanation, no extra text.`

    const contextLine = isMixed
      ? 'This paper contains mixed topics — extract all questions without assuming a specific subtopic.'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : `Context: Topic ${topic?.ref ?? '?'} – ${topic?.name ?? 'Unknown'} | Subtopic ${subtopic?.ref ?? '?'} – ${(subtopic as any)?.title ?? 'Unknown'}`

    const userContent = `Extract all exam questions from this Cambridge IGCSE Mathematics document.
${contextLine}

---
${text.slice(0, 14_000)}
---`

    const aiResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    })

    const raw =
      aiResponse.content[0].type === 'text' ? aiResponse.content[0].text.trim() : ''

    // Strip accidental markdown fences if the model adds them
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

    let aiQuestions: AIQuestion[] = []
    try {
      aiQuestions = JSON.parse(jsonStr)
      if (!Array.isArray(aiQuestions)) throw new Error('Response is not an array')
    } catch {
      return NextResponse.json(
        { error: 'AI returned malformed JSON', raw },
        { status: 502 },
      )
    }

    // ── Insert into questions table ──────────────────────────────────────────
    const rows = aiQuestions.map((q) => ({
      exam_board_id,
      topic_id: isMixed ? null : (subtopic?.topic_id ?? null),
      subtopic_id: isMixed ? null : subtopic_id,
      content_text: String(q.content_text ?? '').trim(),
      difficulty: Math.min(5, Math.max(1, Math.round(Number(q.difficulty) || 2))),
      question_type: VALID_QUESTION_TYPES.includes(q.question_type)
        ? q.question_type
        : ('structured' as QuestionType),
      marks: Math.max(1, Math.round(Number(q.marks) || 1)),
      status: 'draft' as const,
      ai_extracted: true,
    }))

    const { data: saved, error: dbError } = await supabase
      .from('questions')
      .insert(rows)
      .select()

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    // Merge AI-computed subtopic_ref back into the saved rows for the UI
    const questions = (saved ?? []).map((q, i) => ({
      ...q,
      subtopic_ref: aiQuestions[i]?.subtopic_ref ?? subtopic?.ref ?? '',
    }))

    return NextResponse.json({ questions, count: questions.length })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    console.error('[POST /api/ingest] FULL ERROR:', err)
    return NextResponse.json({ error: message, stack }, { status: 500 })
  }
}
