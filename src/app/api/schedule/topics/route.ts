export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  try {
    // Fetch topics ordered by sort_order
    const topicsRaw = await prisma.topics.findMany({ orderBy: { sort_order: 'asc' } })
    const topicIds = topicsRaw.map(t => t.id)

    // Fetch all subtopics for these topics
    const subtopicsRaw = await prisma.subtopics.findMany({
      where: { topic_id: { in: topicIds } },
      orderBy: { sort_order: 'asc' },
    })
    const subtopicIds = subtopicsRaw.map(s => s.id)

    // Fetch ppt_decks for all subtopics
    let pptBySubtopic: Record<string, typeof pptData> = {}
    if (subtopicIds.length > 0) {
      const pptData = await prisma.ppt_decks.findMany({
        where: { subtopic_id: { in: subtopicIds } },
        select: {
          id: true,
          subtopic_id: true,
          title: true,
          status: true,
          slides: true,
          created_by: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: { created_at: 'desc' },
      })
      for (const deck of pptData) {
        if (!deck.subtopic_id) continue
        if (!pptBySubtopic[deck.subtopic_id]) pptBySubtopic[deck.subtopic_id] = []
        pptBySubtopic[deck.subtopic_id].push(deck)
      }
    }

    // Group subtopics by topic_id
    const subtopicsByTopic: Record<string, typeof subtopicsRaw> = {}
    for (const s of subtopicsRaw) {
      if (!subtopicsByTopic[s.topic_id]) subtopicsByTopic[s.topic_id] = []
      subtopicsByTopic[s.topic_id].push(s)
    }

    // Assemble final shape
    const topics = topicsRaw.map(t => ({
      ...t,
      subtopics: (subtopicsByTopic[t.id] ?? []).map(s => ({
        ...s,
        ppt_decks: pptBySubtopic[s.id] ?? [],
      })),
    }))

    return NextResponse.json({ topics })
  } catch (err) {
    console.error('[GET /api/schedule/topics]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      ref: string
      name: string
      subtopic_count: number
      total_questions: number
      ppt_decks: number
      completion_date: string | null
      hours_est: number | null
    }

    const sort_order = await prisma.topics.count() + 1

    const data = await prisma.topics.create({
      data: {
        id: crypto.randomUUID(),
        ref: body.ref,
        name: body.name,
        subtopic_count: body.subtopic_count,
        total_questions: body.total_questions,
        ppt_decks: body.ppt_decks,
        completion_date: body.completion_date ? new Date(body.completion_date) : null,
        hours_est: body.hours_est,
        sort_order,
      },
    })

    return NextResponse.json({ topic: { ...data, subtopics: [] } })
  } catch (err) {
    console.error('[POST /api/schedule/topics]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
