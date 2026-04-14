export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  const [assignments, topics, subjects] = await Promise.all([
    prisma.tutor_topic_assignments.findMany({
      select: { id: true, user_id: true, topic_id: true, subject_id: true },
    }),
    prisma.topics.findMany({
      select: { id: true, name: true, ref: true, subject_id: true },
      orderBy: { ref: 'asc' },
    }),
    prisma.subjects.findMany({
      where: { active: true },
      select: { id: true, name: true, code: true, color: true },
      orderBy: { sort_order: 'asc' },
    }),
  ])

  return NextResponse.json({ assignments, topics, subjects })
}

export async function POST(request: Request) {
  const { user_id, topic_id, subject_id } = await request.json()

  if (!user_id || !topic_id || !subject_id) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  try {
    const existing = await prisma.tutor_topic_assignments.findFirst({
      where: { user_id, topic_id },
    })
    if (existing) {
      await prisma.tutor_topic_assignments.update({
        where: { id: existing.id },
        data: { subject_id },
      })
    } else {
      await prisma.tutor_topic_assignments.create({
        data: { id: crypto.randomUUID(), user_id, topic_id, subject_id },
      })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[POST /api/users/assignments]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { user_id, topic_id } = await request.json()

  if (!user_id || !topic_id) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  try {
    await prisma.tutor_topic_assignments.deleteMany({
      where: { user_id, topic_id },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/users/assignments]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
