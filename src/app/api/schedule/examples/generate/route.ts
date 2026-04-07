import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { createAnthropicClient } from '@/lib/anthropic'

export const runtime = 'nodejs'

interface GenerateBody {
  subtopic_id:    string
  subtopic_ref:   string
  subtopic_title: string
  topic_name:     string
}

interface AIExample {
  question_id:  string
  explanation:  string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GenerateBody
    const { subtopic_id, subtopic_ref, subtopic_title, topic_name } = body

    if (!subtopic_id) {
      return NextResponse.json({ error: 'subtopic_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Count existing examples
    const { count: existingCount, error: countErr } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('subtopic_id', subtopic_id)
      .eq('is_example', true)

    if (countErr) {
      return NextResponse.json({ error: countErr.message }, { status: 500 })
    }

    if ((existingCount ?? 0) >= 3) {
      return NextResponse.json({ error: 'Maximum examples already generated' }, { status: 400 })
    }

    const needed = 3 - (existingCount ?? 0)

    // Fetch approved non-example questions (flat — no embedded join)
    const { data: questionsRaw, error: qErr } = await supabase
      .from('questions')
      .select('id, content_text, marks, question_type')
      .eq('subtopic_id', subtopic_id)
      .eq('status', 'approved')
      .eq('is_example', false)
      .limit(20)

    if (qErr) {
      return NextResponse.json({ error: qErr.message }, { status: 500 })
    }

    const questionIds = (questionsRaw ?? []).map((q) => q.id)

    // Fetch answers for those questions separately
    let answersRaw: { question_id: string; content_text: string; step_by_step: string[]; mark_scheme: string; status: string }[] = []
    if (questionIds.length > 0) {
      const { data: aData } = await supabase
        .from('answers')
        .select('question_id, content_text, step_by_step, mark_scheme, status')
        .in('question_id', questionIds)
      answersRaw = (aData ?? []) as typeof answersRaw
    }

    // Group answers by question_id
    const answersMap = new Map<string, typeof answersRaw>()
    for (const a of answersRaw) {
      const arr = answersMap.get(a.question_id) ?? []
      arr.push(a)
      answersMap.set(a.question_id, arr)
    }

    // Stitch questions with answers
    const questions = (questionsRaw ?? []).map((q) => ({
      ...q,
      answers: answersMap.get(q.id) ?? [],
    }))

    const available = questions.filter(
      (q) => Array.isArray(q.answers) && q.answers.some((a) => a.status === 'approved'),
    )

    if (available.length === 0) {
      return NextResponse.json(
        { error: 'No approved questions available for this subtopic' },
        { status: 400 },
      )
    }

    // Build context for Claude
    const qContext = available.map((q) => {
      const ans = q.answers.find((a) => a.status === 'approved') ?? q.answers[0]
      return {
        id:           q.id,
        question:     q.content_text,
        marks:        q.marks,
        type:         q.question_type,
        answer:       ans?.content_text ?? '',
        steps:        (ans?.step_by_step ?? []).join('\n'),
        mark_scheme:  ans?.mark_scheme ?? '',
      }
    })

    const systemPrompt = `You are an assistant helping create worked examples for IGCSE Mathematics students.
You will be given a list of approved questions and answers from our question bank.
Your job is to SELECT the best examples from this list only — you must NOT invent, modify, or add any question or answer that is not in the provided input.
Return exactly JSON with this shape:
{ "examples": [{ "question_id": "string", "explanation": "string" }] }
The explanation field should be a clear step-by-step worked solution suitable for an IGCSE student, based strictly on the provided answer content.
Select the most representative and pedagogically useful questions.
Return exactly ${needed} example(s).
Return only valid JSON — no markdown fences.`

    const userContent = `Topic: ${topic_name}
Subtopic: ${subtopic_ref} – ${subtopic_title}
Need to select ${needed} worked example(s).

Available questions:
${JSON.stringify(qContext, null, 2)}`

    const anthropic = createAnthropicClient()
    const aiResponse = await anthropic.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 4096,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: userContent }],
    })

    const raw = aiResponse.content[0].type === 'text' ? aiResponse.content[0].text.trim() : ''
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

    let parsed: { examples: AIExample[] }
    try {
      parsed = JSON.parse(jsonStr)
      if (!Array.isArray(parsed.examples)) throw new Error('Missing examples array')
    } catch {
      return NextResponse.json({ error: 'AI returned malformed JSON', raw }, { status: 502 })
    }

    // Mark selected questions as examples
    const updatedIds: string[] = []
    for (const ex of parsed.examples) {
      const { error: updateErr } = await supabase
        .from('questions')
        .update({ is_example: true })
        .eq('id', ex.question_id)
        .eq('subtopic_id', subtopic_id) // safety check

      if (!updateErr) {
        updatedIds.push(ex.question_id)

        // Prepend explanation to the approved answer's content_text
        const { data: ans } = await supabase
          .from('answers')
          .select('id, content_text')
          .eq('question_id', ex.question_id)
          .eq('status', 'approved')
          .single()

        if (ans) {
          const newText = ex.explanation
            ? `${ex.explanation}\n\n---\n\n${ans.content_text}`
            : ans.content_text
          await supabase
            .from('answers')
            .update({ content_text: newText })
            .eq('id', ans.id)
        }
      }
    }

    // Return updated examples list (flat fetch, no embedded join)
    const { data: exampleQs } = await supabase
      .from('questions')
      .select('id, content_text')
      .eq('subtopic_id', subtopic_id)
      .eq('is_example', true)

    const exampleIds = (exampleQs ?? []).map((q) => q.id)
    let exampleAnswers: { question_id: string; id: string; content_text: string; step_by_step: string[]; status: string }[] = []
    if (exampleIds.length > 0) {
      const { data: eaData } = await supabase
        .from('answers')
        .select('question_id, id, content_text, step_by_step, status')
        .in('question_id', exampleIds)
      exampleAnswers = (eaData ?? []) as typeof exampleAnswers
    }

    const exAnswersMap = new Map<string, typeof exampleAnswers>()
    for (const a of exampleAnswers) {
      const arr = exAnswersMap.get(a.question_id) ?? []
      arr.push(a)
      exAnswersMap.set(a.question_id, arr)
    }

    const newExamples = (exampleQs ?? []).map((q) => ({
      ...q,
      answers: exAnswersMap.get(q.id) ?? [],
    }))

    return NextResponse.json({
      ok:       true,
      examples: newExamples,
      count:    newExamples.length,
    })
  } catch (err) {
    console.error('[POST /api/schedule/examples/generate]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
