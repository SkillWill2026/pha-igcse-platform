export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json() as { ids?: unknown }
    const { ids } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: '`ids` must be a non-empty array of question UUIDs' },
        { status: 400 },
      )
    }

    await prisma.questions.updateMany({
      where: { id: { in: ids as string[] } },
      data: { status: 'approved' },
    })

    const data = await prisma.questions.findMany({
      where: { id: { in: ids as string[] } },
      select: { id: true, serial_number: true },
    })

    const serials = data
      .map(r => r.serial_number)
      .filter((s): s is string => s !== null)

    return NextResponse.json({ updated: data.length, serials })
  } catch (err) {
    console.error('[PATCH /api/questions/approve]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
