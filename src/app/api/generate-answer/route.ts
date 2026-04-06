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

    const { data: question, error: qErr } = await supabase
      .from('questions')
      .select(`
        id, content_text, difficulty, question_type, marks,
        topics(ref, name),
        subtopics(ref, name),
        exam_boards(name)
      `)
      .eq('id', question_id)
      .single()

    if (qErr || !question) {
      console.log('[generate-answer] question not found — id:', question_id, 'err:', qErr?.message)
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }
    console.log('[generate-answer] question loaded:', question_id)

    const anthropic = createAnthropicClient()

    const systemPrompt =
      'You are an expert Cambridge IGCSE Mathematics tutor. Generate a complete worked solution for this exam question. Return JSON with: step_by_step (array of strings, each a clear working step using LaTeX for math), final_answer (string), mark_scheme (string describing what earns marks), confidence_score (0.0 to 1.0).'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const q = question as any
    const context = [
      `Exam: Cambridge IGCSE Mathematics 0580`,
      `Topic: ${q.topics?.ref} – ${q.topics?.name}`,
      `Subtopic: ${q.subtopics?.ref} – ${q.subtopics?.name}`,
      `Type: ${q.question_type}  |  Marks: ${q.marks}  |  Difficulty: ${q.difficulty}/5`,
    ].join('\n')

    const aiResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `${context}\n\nQuestion:\n${q.content_text}\n\nReturn only valid JSON — no markdown fences.`,
        },
      ],
    })

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

    const { data: saved, error: dbErr } = await supabase
      .from('answers')
      .upsert(
        {
          question_id,
          content_text: String(aiAnswer.final_answer ?? ''),
          step_by_step: aiAnswer.step_by_step.map(String),
          mark_scheme: String(aiAnswer.mark_scheme ?? ''),
          confidence_score: Math.min(1, Math.max(0, Number(aiAnswer.confidence_score) || 0)),
          status: 'draft' as const,
          ai_generated: true,
        },
        { onConflict: 'question_id' },
      )
      .select()
      .single()

    console.log('[generate-answer] upsert result — id:', saved?.id ?? null, 'dbErr:', dbErr?.message ?? 'none')
    if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
    if (!saved) return NextResponse.json({ error: 'Upsert returned no data' }, { status: 500 })

    revalidatePath('/admin/answers', 'layout')
    return NextResponse.json({ answer: saved })
  } catch (err) {
    console.error('[POST /api/generate-answer]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
