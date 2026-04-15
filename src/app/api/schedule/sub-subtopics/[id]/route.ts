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

    const allowed = ['ext_num', 'core_num', 'outcome', 'tier', 'notes', 'sort_order']
    const updates: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in body) updates[key] = body[key]
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const data = await prisma.sub_subtopics.update({
      where: { id: params.id },
      data:  updates as Prisma.sub_subtopicsUpdateInput,
    })

    return NextResponse.json({ sub_subtopic: data })
  } catch (err) {
    console.error(`[PATCH /api/schedule/sub-subtopics/${params.id}]`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Nullify questions referencing this sub_subtopic
      await tx.questions.updateMany({
        where: { sub_subtopic_id: params.id },
        data:  { sub_subtopic_id: null },
      })

      // 2. Now safe to delete the sub_subtopic
      await tx.sub_subtopics.delete({
        where: { id: params.id },
      })
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(`[DELETE /api/schedule/sub-subtopics/${params.id}]`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
