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

    let generatedContent = ''
    try {
      const message = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `You are an IGCSE Maths tutor.
START your response with exactly these two lines:
**Working:**
Step 1:
Then continue with numbered steps showing full working.
End with:
**Answer:**
[final answer with units]

Use LaTeX notation for ALL mathematical expressions:
- Inline math: $expression$ (e.g. $x^2$, $\frac{a}{b}$, $\sqrt{x}$)
- Display math: $$expression$$ for standalone equations
- Examples: $8000 \times (0.75)^3$, $\frac{360° - 48°}{360°} \times \pi r^2$
Always use LaTeX for fractions, powers, roots, and Greek letters.

Topic: ${topic?.name ?? 'Mathematics'}, Marks: ${question.marks ?? 'N/A'}
Question: ${question.content_text}`
          }
        ]
      })
      generatedContent = message.content[0].type === 'text' ? message.content[0].text : ''
    } catch (err: any) {
      console.error('[generate-answer] Anthropic error:', err)
      return NextResponse.json(
        { error: 'Generation failed — please try again.' },
        { status: 503 }
      )
    }

    const raw = generatedContent.trim()
    console.log('[generate-answer] AI raw response (first 200):', raw.slice(0, 200))

    // Use full markdown response as answer content
    const aiAnswer: AIAnswer = {
      step_by_step: [],
      final_answer: raw,
      mark_scheme: '',
      confidence_score: 0.75
    }

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
          content: String(aiAnswer.final_answer ?? ''),
          step_by_step: aiAnswer.step_by_step.map(String),
          mark_scheme: String(aiAnswer.mark_scheme ?? ''),
          confidence_score: Math.min(1, Math.max(0, Number(aiAnswer.confidence_score) || 0)),
          status: question.status,
          ai_generated: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select('id, content, step_by_step, mark_scheme, confidence_score, status, ai_generated, serial_number, created_at, updated_at')
        .single()

      dbErr = updateRes.error
      saved = updateRes.data
    } else {
      // Insert new answer
      const insertRes = await supabase
        .from('answers')
        .insert({
          question_id,
          content: String(aiAnswer.final_answer ?? ''),
          step_by_step: aiAnswer.step_by_step.map(String),
          mark_scheme: String(aiAnswer.mark_scheme ?? ''),
          confidence_score: Math.min(1, Math.max(0, Number(aiAnswer.confidence_score) || 0)),
          status: question.status,
          ai_generated: true,
        })
        .select('id, content, step_by_step, mark_scheme, confidence_score, status, ai_generated, serial_number, created_at, updated_at')
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
