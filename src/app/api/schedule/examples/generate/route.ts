export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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

    // Count existing examples
    const existingCount = await prisma.questions.count({
      where: { subtopic_id, is_example: true },
    })

    if (existingCount >= 3) {
      return NextResponse.json({ error: 'Maximum examples already generated' }, { status: 400 })
    }

    const needed = 3 - existingCount

    // Fetch approved non-example questions
    const questionsRaw = await prisma.questions.findMany({
      where:  { subtopic_id, status: 'approved', is_example: false },
      select: { id: true, content_text: true, marks: true, question_type: true },
      take:   20,
    })

    const questionIds = questionsRaw.map(q => q.id)

    // Fetch answers for those questions separately
    const answersRaw = questionIds.length > 0
      ? await prisma.answers.findMany({
          where:  { question_id: { in: questionIds } },
          select: { question_id: true, content: true, step_by_step: true, mark_scheme: true, status: true },
        })
      : []

    // Group answers by question_id
    const answersMap = new Map<string, typeof answersRaw>()
    for (const a of answersRaw) {
      if (!a.question_id) continue
      const arr = answersMap.get(a.question_id) ?? []
      arr.push(a)
      answersMap.set(a.question_id, arr)
    }

    // Stitch questions with answers
    const questions = questionsRaw.map(q => ({
      ...q,
      answers: answersMap.get(q.id) ?? [],
    }))

    const available = questions.filter(
      q => Array.isArray(q.answers) && q.answers.some(a => a.status === 'approved'),
    )

    if (available.length === 0) {
      return NextResponse.json(
        { error: 'No approved questions available for this subtopic' },
        { status: 400 },
      )
    }

    // Build context for Claude
    const qContext = available.map(q => {
      const ans = q.answers.find(a => a.status === 'approved') ?? q.answers[0]
      return {
        id:          q.id,
        question:    q.content_text,
        marks:       q.marks,
        type:        q.question_type,
        answer:      ans?.content ?? '',
        steps:       (Array.isArray(ans?.step_by_step) ? (ans.step_by_step as string[]) : []).join('\n'),
        mark_scheme: ans?.mark_scheme ?? '',
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

    // Mark selected questions as examples and prepend explanation to answer
    for (const ex of parsed.examples) {
      try {
        await prisma.questions.update({
          where: { id: ex.question_id, subtopic_id },   // safety: must belong to this subtopic
          data:  { is_example: true },
        })

        // Prepend explanation to the approved answer's content
        const ans = await prisma.answers.findFirst({
          where:  { question_id: ex.question_id, status: 'approved' },
          select: { id: true, content: true },
        })

        if (ans) {
          const newText = ex.explanation
            ? `${ex.explanation}\n\n---\n\n${ans.content}`
            : ans.content
          await prisma.answers.update({
            where: { id: ans.id },
            data:  { content: newText },
          })
        }
      } catch {
        // Skip if update fails (e.g. question doesn't belong to subtopic)
      }
    }

    // Return updated examples list
    const exampleQs = await prisma.questions.findMany({
      where:  { subtopic_id, is_example: true },
      select: { id: true, content_text: true },
    })

    const exampleIds = exampleQs.map(q => q.id)
    const exampleAnswersRaw = exampleIds.length > 0
      ? await prisma.answers.findMany({
          where:  { question_id: { in: exampleIds } },
          select: { question_id: true, id: true, content: true, step_by_step: true, status: true },
        })
      : []

    const exAnswersMap = new Map<string, typeof exampleAnswersRaw>()
    for (const a of exampleAnswersRaw) {
      if (!a.question_id) continue
      const arr = exAnswersMap.get(a.question_id) ?? []
      arr.push(a)
      exAnswersMap.set(a.question_id, arr)
    }

    const newExamples = exampleQs.map(q => ({
      id:      q.id,
      content: q.content_text,   // maintain response shape expected by frontend
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
