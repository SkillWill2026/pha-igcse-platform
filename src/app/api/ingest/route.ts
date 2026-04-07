import { NextRequest, NextResponse } from 'next/server'
import { createAnthropicClient } from '@/lib/anthropic'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

const VALID_QUESTION_TYPES = ['mcq', 'short_answer', 'structured', 'extended'] as const
type QuestionType = (typeof VALID_QUESTION_TYPES)[number]

interface AIQuestion {
  content: string
  parent_question_ref: string | null
  part_label: string | null
  question_type: QuestionType
  difficulty: number
  marks: number | null
  subtopic_ref?: string
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
    const sub_subtopic_id = (formData.get('sub_subtopic_id') as string | null) || null
    const batch_id        = (formData.get('batch_id')        as string | null) || null

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

EXTRACTION RULES:
- Extract every question and sub-question from the document.
- When a question has parts labelled (a), (b), (c), (i), (ii), (iii) etc., treat EACH PART as a completely separate, independent question.
- For each part, the "content" field must contain: the full context needed to answer that part (include any shared stem or scenario from the parent question at the top), then the specific part question. Do NOT include the parent question number in the content.
- Set "parent_question_ref" to the original question number from the paper (e.g. "3" for Question 3).
- Set "part_label" to the part letter or number (e.g. "a", "b", "i", "ii"). Leave null if the question has no parts.
- If a question has no parts, set both parent_question_ref and part_label to null.
- Never merge multiple parts into a single question.
- Include ALL parts — do not skip any.

Return ONLY a valid JSON array where each element is one independent question with exactly these fields:
{
  "content": "full question text including any shared context",
  "parent_question_ref": "3" or null,
  "part_label": "a" or null,
  "question_type": "mcq" | "short_answer" | "structured" | "extended",
  "difficulty": 1-5,
  "marks": number or null
}

difficulty scale:
  1 = single-step recall
  2 = routine multi-step
  3 = moderate application / unfamiliar context
  4 = challenging reasoning or proof
  5 = extended problem solving / investigation

Output ONLY the JSON array — no markdown fences, no explanation, no extra text.`

    const contextLine = isMixed
      ? 'This paper contains mixed topics — extract all questions without assuming a specific subtopic.'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : `Context: Topic ${topic?.ref ?? '?'} – ${topic?.name ?? 'Unknown'} | Subtopic ${subtopic?.ref ?? '?'} – ${(subtopic as any)?.title ?? 'Unknown'}`

    // Chunk-based extraction: process up to 3 chunks of 3 000 chars each.
    // If a chunk fails to parse it is skipped — resilient to garbled PDFs.
    const CHUNK_SIZE = 3000
    const sourceText = text.slice(0, 9_000)
    const chunks: string[] = []
    for (let i = 0; i < sourceText.length; i += CHUNK_SIZE) {
      chunks.push(sourceText.slice(i, i + CHUNK_SIZE))
    }
    console.log(`[ingest] chunks: ${chunks.length}, total chars: ${sourceText.length}`)

    const extractionPrompt = `${systemPrompt}\n\n${contextLine}`

    const allQuestions: AIQuestion[] = []
    for (let chunkIdx = 0; chunkIdx < chunks.length; chunkIdx++) {
      const chunk = chunks[chunkIdx]
      try {
        const response = await anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `${extractionPrompt}\n\nDOCUMENT TEXT:\n${chunk}`,
          }],
        })
        const raw = response.content[0].type === 'text' ? response.content[0].text : ''
        console.log(`[ingest] chunk ${chunkIdx} raw (first 200):`, raw.slice(0, 200))
        const cleaned = raw
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/```\s*$/i, '')
          .trim()
        const parsed = JSON.parse(cleaned)
        if (Array.isArray(parsed)) {
          allQuestions.push(...(parsed as AIQuestion[]))
        }
      } catch (err) {
        console.log(`[ingest] chunk ${chunkIdx} failed:`, err)
        continue
      }
    }

    if (allQuestions.length === 0) {
      return NextResponse.json(
        { error: 'No questions could be extracted from this document' },
        { status: 422 },
      )
    }

    // ── Insert into questions table ──────────────────────────────────────────
    const rows = allQuestions.map((q) => ({
      exam_board_id,
      topic_id: isMixed ? null : (subtopic?.topic_id ?? null),
      subtopic_id: isMixed ? null : subtopic_id,
      sub_subtopic_id: sub_subtopic_id || null,
      content_text: String(q.content ?? '').trim(),
      parent_question_ref: q.parent_question_ref ?? null,
      part_label: q.part_label ?? null,
      batch_id: batch_id ?? null,
      difficulty: Math.min(5, Math.max(1, Math.round(Number(q.difficulty) || 2))),
      question_type: VALID_QUESTION_TYPES.includes(q.question_type)
        ? q.question_type
        : ('structured' as QuestionType),
      marks: q.marks != null ? Math.max(1, Math.round(Number(q.marks))) : 1,
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

    // Merge subtopic_ref back for the UI (best-effort from AI or context)
    const questions = (saved ?? []).map((q, i) => ({
      ...q,
      subtopic_ref: allQuestions[i]?.subtopic_ref ?? subtopic?.ref ?? '',
    }))

    return NextResponse.json({ questions, count: questions.length })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    console.error('[POST /api/ingest] FULL ERROR:', err)
    return NextResponse.json({ error: message, stack }, { status: 500 })
  }
}
