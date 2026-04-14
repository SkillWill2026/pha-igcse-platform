export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const [answersRaw, topics, subtopics] = await Promise.all([
      prisma.answers.findMany({
        where: {
          status: { in: ['approved', 'draft'] },
          OR: [
            { confidence_score: { lt: 0.7 } },
            { confidence_score: null },
          ],
        },
        select: {
          id: true,
          serial_number: true,
          content: true,
          confidence_score: true,
          status: true,
          created_at: true,
          question_id: true,
        },
        orderBy: { confidence_score: { sort: 'asc', nulls: 'first' } },
        take: 200,
      }),
      prisma.topics.findMany({ select: { id: true, name: true, ref: true } }),
      prisma.subtopics.findMany({ select: { id: true, title: true } }),
    ])

    // Fetch questions for all answer question_ids
    const questionIds = [...new Set(answersRaw.map(a => a.question_id).filter((id): id is string => id !== null))]
    const questionsRaw = questionIds.length > 0
      ? await prisma.questions.findMany({
          where: { id: { in: questionIds } },
          select: { id: true, serial_number: true, content_text: true, status: true, topic_id: true, subtopic_id: true },
        })
      : []

    const questionMap = Object.fromEntries(questionsRaw.map(q => [q.id, q]))
    const topicMap = Object.fromEntries(topics.map(t => [t.id, t]))
    const subtopicMap = Object.fromEntries(subtopics.map(s => [s.id, s]))

    const answers = answersRaw.map(a => {
      const question = a.question_id ? questionMap[a.question_id] ?? null : null
      return {
        ...a,
        questions: question
          ? {
              ...question,
              topics: question.topic_id ? topicMap[question.topic_id] ?? null : null,
              subtopics: question.subtopic_id ? subtopicMap[question.subtopic_id] ?? null : null,
            }
          : null,
      }
    })

    return NextResponse.json({ answers })
  } catch (err) {
    console.error('[GET /api/answer-queue]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
