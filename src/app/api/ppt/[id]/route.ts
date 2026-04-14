export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import type { Slide } from '@/types/ppt'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const deck = await prisma.ppt_decks.findUnique({ where: { id: params.id } })
    if (!deck) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ deck })
  } catch (err) {
    console.error('[GET /api/ppt/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json() as {
      slides?:      Slide[]
      status?:      'draft' | 'approved'
      title?:       string
      tutor_notes?: string
    }

    const updates: Prisma.ppt_decksUpdateInput = { updated_at: new Date() }
    if (body.slides      !== undefined) updates.slides      = body.slides as Prisma.InputJsonValue
    if (body.status      !== undefined) updates.status      = body.status
    if (body.title       !== undefined) updates.title       = body.title
    if (body.tutor_notes !== undefined) updates.tutor_notes = body.tutor_notes

    const deck = await prisma.ppt_decks.update({
      where: { id: params.id },
      data:  updates,
    })

    return NextResponse.json({ deck })
  } catch (err) {
    console.error('[PATCH /api/ppt/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.ppt_decks.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/ppt/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
