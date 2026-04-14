export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subtopic_id = searchParams.get('subtopic_id')
    const subject_id  = searchParams.get('subject_id')
    const status      = searchParams.get('status')

    const where: Prisma.ppt_decksWhereInput = {}
    if (subtopic_id) where.subtopic_id = subtopic_id
    if (subject_id)  where.subject_id  = subject_id
    if (status === 'approved' || status === 'draft') where.status = status

    const decks = await prisma.ppt_decks.findMany({
      where,
      select: {
        id:           true,
        title:        true,
        status:       true,
        subtopic_id:  true,
        subject_id:   true,
        created_at:   true,
        updated_at:   true,
        tutor_notes:  true,
      },
      orderBy: { created_at: 'desc' },
    })

    return NextResponse.json({ decks })
  } catch (err) {
    console.error('[GET /api/ppt]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
