export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      topic_id: string
      ref: string
      title: string
      due_date: string | null
      sprint_week: number | null
      qs_total: number
      mcq_count: number
      short_ans_count: number
      structured_count: number
      extended_count: number
      status: string
      ppt_required?: boolean
      examples_required?: number
      tier?: string
    }

    if (!body.topic_id || !body.title) {
      return NextResponse.json({ error: 'topic_id and title are required' }, { status: 400 })
    }

    const sort_order = await prisma.subtopics.count({
      where: { topic_id: body.topic_id },
    }) + 1

    const data = await prisma.subtopics.create({
      data: {
        topic_id:         body.topic_id,
        ref:              body.ref,
        title:            body.title,
        due_date:         body.due_date ? new Date(body.due_date) : null,
        sprint_week:      body.sprint_week != null ? String(body.sprint_week) : null,
        qs_total:         body.qs_total,
        mcq_count:        body.mcq_count,
        short_ans_count:  body.short_ans_count,
        structured_count: body.structured_count,
        extended_count:   body.extended_count,
        status:           body.status,
        sort_order,
        ppt_required:     body.ppt_required ?? false,
        examples_required: body.examples_required ?? 0,
        tier:             body.tier ?? 'core',
      },
    })

    return NextResponse.json({ subtopic: data })
  } catch (err) {
    console.error('[POST /api/schedule/subtopics]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
