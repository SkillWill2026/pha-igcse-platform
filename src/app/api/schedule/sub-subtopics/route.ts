export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subtopicId = searchParams.get('subtopic_id')

    const data = await prisma.sub_subtopics.findMany({
      where: subtopicId ? { subtopic_id: subtopicId } : undefined,
      orderBy: { sort_order: 'asc' },
    })

    return NextResponse.json({ sub_subtopics: data ?? [] })
  } catch (err) {
    console.error('[GET /api/schedule/sub-subtopics]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>

    const { subtopic_id, ext_num, core_num, outcome, tier, notes } = body as {
      subtopic_id: string
      ext_num: number
      core_num?: number | null
      outcome: string
      tier?: string
      notes?: string | null
    }

    if (!subtopic_id || !ext_num || !outcome) {
      return NextResponse.json(
        { error: 'Missing required fields: subtopic_id, ext_num, outcome' },
        { status: 400 },
      )
    }

    const sort_order = await prisma.sub_subtopics.count({
      where: { subtopic_id },
    }) + 1

    const data = await prisma.sub_subtopics.create({
      data: {
        subtopic_id,
        ext_num:    Number(ext_num),
        core_num:   core_num != null ? Number(core_num) : null,
        outcome,
        tier:       tier ?? 'both',
        notes:      notes ?? null,
        sort_order,
      },
    })

    return NextResponse.json({ sub_subtopic: data })
  } catch (err) {
    console.error('[POST /api/schedule/sub-subtopics]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
