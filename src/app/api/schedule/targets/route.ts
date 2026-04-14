export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function PATCH(request: Request) {
  const body = await request.json()
  const { total_target, topic_targets } = body

  if (total_target !== undefined) {
    await prisma.production_targets.updateMany({
      where: { NOT: { id: '00000000-0000-0000-0000-000000000000' } },
      data: { total_target, updated_at: new Date() },
    })
  }

  if (topic_targets && Array.isArray(topic_targets)) {
    for (const tt of topic_targets) {
      await prisma.production_topic_targets.updateMany({
        where: { topic_id: tt.topic_id },
        data: { target: tt.target, updated_at: new Date() },
      })
    }
  }

  return NextResponse.json({ success: true })
}
