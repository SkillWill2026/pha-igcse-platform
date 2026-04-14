export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const topicId       = searchParams.get('topic_id')
  const subtopicId    = searchParams.get('subtopic_id')
  const subSubtopicId = searchParams.get('sub_subtopic_id')
  const batchId       = searchParams.get('batch_id')
  const statusParam   = searchParams.get('status')
  const subjectId     = searchParams.get('subject_id')

  try {
    const where: Prisma.questionsWhereInput = {}

    // Status filtering: default to active (draft+approved), or filter by explicit status
    if (statusParam === 'rejected') {
      where.status = 'rejected'
    } else if (statusParam === 'deleted') {
      where.status = 'deleted'
    } else if (statusParam !== 'all') {
      where.status = { in: ['draft', 'approved'] }
    }

    // If subject_id given but no topic_id, scope questions to that subject's topics
    if (subjectId && (!topicId || topicId === '')) {
      const subjectTopics = await prisma.topics.findMany({
        where: { subject_id: subjectId },
        select: { id: true },
      })
      const subjectTopicIds = subjectTopics.map(t => t.id)
      if (subjectTopicIds.length === 0) return NextResponse.json([])
      where.topic_id = { in: subjectTopicIds }
    }

    if (topicId       && topicId       !== '') where.topic_id        = topicId
    if (subtopicId    && subtopicId    !== '') where.subtopic_id     = subtopicId
    if (subSubtopicId && subSubtopicId !== '') where.sub_subtopic_id = subSubtopicId
    if (batchId       && batchId       !== '') where.batch_id        = batchId

    const rows = await prisma.questions.findMany({ where, orderBy: { serial_number: 'asc' } })

    // Collect unique FK ids for parallel reference fetches
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const questionIds  = rows.map((q: any) => q.id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topicIds     = [...new Set(rows.map((q: any) => q.topic_id).filter(Boolean))]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subtopicIds  = [...new Set(rows.map((q: any) => q.subtopic_id).filter(Boolean))]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const boardIds     = [...new Set(rows.map((q: any) => q.exam_board_id).filter(Boolean))]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sstIds       = [...new Set(rows.map((q: any) => q.sub_subtopic_id).filter(Boolean))]

    const [topicsData, subtopicsData, boardsData, sstData, answersData] = await Promise.all([
      topicIds.length    > 0 ? prisma.topics.findMany({ where: { id: { in: topicIds as string[] } }, select: { id: true, ref: true, name: true } }) : Promise.resolve([]),
      subtopicIds.length > 0 ? prisma.subtopics.findMany({ where: { id: { in: subtopicIds as string[] } }, select: { id: true, ref: true, title: true } }) : Promise.resolve([]),
      boardIds.length    > 0 ? prisma.exam_boards.findMany({ where: { id: { in: boardIds as string[] } }, select: { id: true, name: true } }) : Promise.resolve([]),
      sstIds.length      > 0 ? prisma.sub_subtopics.findMany({ where: { id: { in: sstIds as string[] } }, select: { id: true, ext_num: true, outcome: true, tier: true } }) : Promise.resolve([]),
      questionIds.length > 0 ? prisma.answers.findMany({ where: { question_id: { in: questionIds as string[] } }, select: { question_id: true, serial_number: true, status: true } }) : Promise.resolve([]),
    ])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topicMap    = new Map(topicsData.map((r: any)    => [r.id, r]))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subtopicMap = new Map(subtopicsData.map((r: any) => [r.id, r]))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const boardMap    = new Map(boardsData.map((r: any)    => [r.id, r]))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sstMap      = new Map(sstData.map((r: any)       => [r.id, r]))
    const answerMap   = new Map<string, { serial_number: string | null; status: string }>()
    for (const a of answersData) {
      if (a.question_id && !answerMap.has(a.question_id)) {
        answerMap.set(a.question_id, {
          serial_number: a.serial_number ?? null,
          status: a.status ?? 'draft',
        })
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const questions = rows.map((q: any) => {
      const sub    = subtopicMap.get(q.subtopic_id)
      const answer = answerMap.get(q.id)
      return {
        ...q,
        exam_boards:   boardMap.get(q.exam_board_id)  ?? null,
        topics:        topicMap.get(q.topic_id)        ?? null,
        subtopics:     sub ? { id: q.subtopic_id, ref: sub.ref, name: sub.title ?? '' } : null,
        sub_subtopics: sstMap.get(q.sub_subtopic_id)  ?? null,
        answer_serial: answer?.serial_number ?? null,
        answer_status: answer?.status ?? null,
      }
    })

    return NextResponse.json(questions)
  } catch (err) {
    console.error('[GET /api/questions] unexpected:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
