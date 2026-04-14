export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const [rejected, deleted] = await Promise.all([
      prisma.questions.count({ where: { status: 'rejected' } }),
      prisma.questions.count({ where: { status: 'deleted' } }),
    ])
    return NextResponse.json({ rejected, deleted })
  } catch (err) {
    console.error('[GET /api/questions/counts]', err)
    return NextResponse.json({ rejected: 0, deleted: 0 })
  }
}
