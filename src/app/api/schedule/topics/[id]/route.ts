export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json() as Record<string, unknown>

    const allowed = [
      'ref', 'name', 'subtopic_count', 'total_questions', 'ppt_decks',
      'completion_date', 'hours_est', 'sort_order', 'subject_id',
    ]
    const updates: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in body) {
        if (key === 'completion_date') {
          updates[key] = body[key] ? new Date(body[key] as string) : null
        } else {
          updates[key] = body[key]
        }
      }
    }

    const data = await prisma.topics.update({
      where: { id: params.id },
      data: updates as Prisma.topicsUpdateInput,
    })

    return NextResponse.json({ topic: data })
  } catch (err) {
    console.error('[PATCH /api/schedule/topics/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Subtopics cascade via FK
    await prisma.topics.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/schedule/topics/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
