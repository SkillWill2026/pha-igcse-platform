export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const topicId = request.nextUrl.searchParams.get('topic_id')
  if (!topicId) return NextResponse.json([])

  try {
    const data = await prisma.subtopics.findMany({
      select: { id: true, ref: true, title: true, tier: true, topic_id: true },
      where: { topic_id: topicId },
      orderBy: { sort_order: 'asc' },
    })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
