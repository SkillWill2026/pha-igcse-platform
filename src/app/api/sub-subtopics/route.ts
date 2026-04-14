export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subtopicId = searchParams.get('subtopic_id')

    if (!subtopicId) {
      return NextResponse.json({ error: 'subtopic_id is required' }, { status: 400 })
    }

    const data = await prisma.sub_subtopics.findMany({
      select: { id: true, ext_num: true, core_num: true, outcome: true, tier: true, sort_order: true },
      where: { subtopic_id: subtopicId },
      orderBy: { sort_order: 'asc' },
    })

    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error('[sub-subtopics] Caught error:', err)
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}
