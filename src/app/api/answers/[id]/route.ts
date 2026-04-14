export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json() as Record<string, unknown>
    const allowed = ['content', 'step_by_step', 'mark_scheme', 'confidence_score', 'status']
    const updates: Record<string, unknown> = {}

    for (const key of allowed) {
      if (key in body) updates[key] = body[key]
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const data = await prisma.answers.update({
      where: { id: params.id },
      data: updates as Prisma.answersUpdateInput,
    })

    revalidatePath('/admin/answers', 'layout')
    return NextResponse.json(data)
  } catch (err) {
    console.error(`[PATCH /api/answers/${params.id}]`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
