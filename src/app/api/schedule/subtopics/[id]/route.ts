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

    // Pick only fields that exist on the subtopics model
    const allowed = [
      'ref', 'title', 'due_date', 'sprint_week', 'qs_total', 'mcq_count',
      'short_ans_count', 'structured_count', 'extended_count', 'status',
      'sort_order', 'ppt_required', 'examples_required', 'tier',
    ]
    const updates: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in body) {
        if (key === 'due_date') {
          updates[key] = body[key] ? new Date(body[key] as string) : null
        } else if (key === 'sprint_week') {
          updates[key] = body[key] != null ? String(body[key]) : null
        } else {
          updates[key] = body[key]
        }
      }
    }

    const data = await prisma.subtopics.update({
      where: { id: params.id },
      data:  updates as Prisma.subtopicsUpdateInput,
    })

    return NextResponse.json({ subtopic: data })
  } catch (err) {
    console.error('[PATCH /api/schedule/subtopics/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.subtopics.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/schedule/subtopics/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
