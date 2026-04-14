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
    const { content, status } = body

    const updates: Record<string, unknown> = {}
    if (content !== undefined) updates.content = content
    if (status !== undefined) updates.status = status

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const answer = await prisma.answers.update({
      where: { id: params.id },
      data: updates as Prisma.answersUpdateInput,
    })

    return NextResponse.json({ answer })
  } catch (err) {
    console.error(`[PATCH /api/answer-queue/${params.id}]`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
