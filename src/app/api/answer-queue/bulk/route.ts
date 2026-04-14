export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { ids?: string[]; status?: string }
    const { ids, status } = body

    if (!ids?.length || !status) {
      return NextResponse.json({ error: 'Missing ids or status' }, { status: 400 })
    }

    await prisma.answers.updateMany({
      where: { id: { in: ids } },
      data: { status, updated_at: new Date() },
    })

    return NextResponse.json({ updated: ids.length })
  } catch (err) {
    console.error('[POST /api/answer-queue/bulk]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
