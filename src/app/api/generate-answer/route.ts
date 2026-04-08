import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createAnthropicClient } from '@/lib/anthropic'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

interface AIAnswer {
  step_by_step: string[]
  final_answer: string
  mark_scheme: string
  confidence_score: number
}

export async function POST(request: NextRequest) {
  try {
    const { question_id } = await request.json() as { question_id?: string }

    if (!question_id) {
      return NextResponse.json({ error: 'question_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Fetch question flat — no PostgREST join syntax to avoid FK constraint failures
    const { data: question, error: qErr } = await supabase
      .from('questions')
      .select('id, content_text, difficulty, question_type, marks, status, topic_id, subtopic_id, sub_subtopic_id, exam_board_id')
      .eq('id', question_id)
      .single()

    if (qErr || !question) {
      console.error('[generate-answer] question not found — id:', question_id, 'err:', qErr?.message)
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Fetch related rows separately
    const [topicRes, subtopicRes, sstRes, boardRes] = await Promise.all([
      question.topic_id
        ? supabase.from('topics').select('ref, name').eq('id', question.topic_id).single()
        : Promise.resolve({ data: null }),
      question.subtopic_id
        ? supabase.from('subtopics').select('ref, title').eq('id', question.subtopic_id).single()
        : Promise.resolve({ data: null }),
      question.sub_subtopic_id
        ? supabase.from('sub_subtopics').select('outcome').eq('id', question.sub_subtopic_id).single()
        : Promise.resolve({ data: null }),
      question.exam_board_id
        ? supabase.from('exam_boards').select('name').eq('id', question.exam_board_id).single()
        : Promise.resolve({ data: null }),
    ])

    const topic    = topicRes.data
    const subtopic = subtopicRes.data
    const sst      = sstRes.data
    const board    = boardRes.data

    console.log('[generate-answer] question loaded:', question_id)

    const anthropic = createAnthropicClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subtopicName = subtopic ? (subtopic as any).title ?? '' : ''
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subSubtopicName = sst ? (sst as any).name ?? '' : ''

    const systemPrompt = 'You are an expert IGCSE Mathematics tutor. Return valid JSON with: step_by_step (array of strings), final_answer (string), mark_scheme (string), confidence_score (0-1).'

    // ── Retry logic for 529 overloaded_error ──────────────────────────────────
    let aiResponse: any = null
    const maxAttempts = 3
    const retryDelays = [0, 1500, 3000]

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        aiResponse = await anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4096,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: `<instructions>
You are an IGCSE Maths tutor. Your response MUST contain exactly two sections in this order with no exceptions:

SECTION 1 - Start your response with this exact line:
**Working:**
Then show numbered steps (Step 1:, Step 2:, etc.)
Show every calculation even for simple questions.

SECTION 2 - End your response with this exact line:
**Answer:**
Then state the final answer with units on the next line.

DO NOT skip the Working section even for 1-mark questions.
DO NOT give just the final answer.
</instructions>

Topic: ${subtopicName || 'Mathematics'}
Sub-topic: ${subSubtopicName || ''}
Marks: ${question.marks ?? 'N/A'}

Question:
${question.content_text}

Return only valid JSON with no markdown fences.`,
            },
          ],
        })
        break
      } catch (err: any) {
        const isOverloaded = err?.status === 529 || err?.error?.type === 'overloaded_error'
        const isLastAttempt = attempt === maxAttempts - 1

        if (isOverloaded && !isLastAttempt) {
          console.warn(`[generate-answer] API overloaded on attempt ${attempt + 1}, retrying in ${retryDelays[attempt + 1]}ms`)
          await new Promise(r => setTimeout(r, retryDelays[attempt + 1]))
        } else {
          throw err
        }
      }
    }

    if (!aiResponse) {
      return NextResponse.json(
        { error: 'AI is busy right now — please try again in a few seconds.' },
        { status: 503 },
      )
    }

    const raw =
      aiResponse.content[0].type === 'text' ? aiResponse.content[0].text.trim() : ''
    console.log('[generate-answer] AI raw response (first 200):', raw.slice(0, 200))
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

    let aiAnswer: AIAnswer
    try {
      aiAnswer = JSON.parse(jsonStr)
      if (!aiAnswer.step_by_step || !Array.isArray(aiAnswer.step_by_step)) {
        throw new Error('Missing step_by_step array')
      }
    } catch {
      console.log('[generate-answer] JSON parse failed, raw:', raw.slice(0, 500))
      return NextResponse.json({ error: 'AI returned malformed JSON', raw }, { status: 502 })
    }
    console.log('[generate-answer] parsed OK — steps:', aiAnswer.step_by_step.length)

    // ── Check-then-branch: update existing or insert new ──────────────────────
    console.log('[generate-answer] Checking for existing answer for question:', question_id)
    const { data: existing } = await supabase
      .from('answers')
      .select('id')
      .eq('question_id', question_id)
      .maybeSingle()
    console.log('[generate-answer] Found existing:', existing)

    let dbErr: any = null
    let saved: any = null

    if (existing?.id) {
      // Update existing answer
      const updateRes = await supabase
        .from('answers')
        .update({
          content_text: String(aiAnswer.final_answer ?? ''),
          step_by_step: aiAnswer.step_by_step.map(String),
          mark_scheme: String(aiAnswer.mark_scheme ?? ''),
          confidence_score: Math.min(1, Math.max(0, Number(aiAnswer.confidence_score) || 0)),
          status: question.status,
          ai_generated: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select('id, content_text, step_by_step, mark_scheme, confidence_score, status, ai_generated, serial_number, created_at, updated_at')
        .single()

      dbErr = updateRes.error
      saved = updateRes.data
    } else {
      // Insert new answer
      const insertRes = await supabase
        .from('answers')
        .insert({
          question_id,
          content_text: String(aiAnswer.final_answer ?? ''),
          step_by_step: aiAnswer.step_by_step.map(String),
          mark_scheme: String(aiAnswer.mark_scheme ?? ''),
          confidence_score: Math.min(1, Math.max(0, Number(aiAnswer.confidence_score) || 0)),
          status: question.status,
          ai_generated: true,
        })
        .select('id, content_text, step_by_step, mark_scheme, confidence_score, status, ai_generated, serial_number, created_at, updated_at')
        .single()

      dbErr = insertRes.error
      saved = insertRes.data
    }

    console.log('[generate-answer] upsert result — id:', saved?.id ?? null, 'dbErr:', dbErr?.message ?? 'none')
    if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
    if (!saved) return NextResponse.json({ error: 'Save returned no data' }, { status: 500 })

    revalidatePath('/admin/answers', 'layout')
    return NextResponse.json({ answer: saved })
  } catch (err) {
    console.error('[POST /api/generate-answer]', err)
    const errMsg = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}
