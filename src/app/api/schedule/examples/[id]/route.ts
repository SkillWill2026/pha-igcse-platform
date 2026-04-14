export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Set is_example = false — does not delete the question itself
    await prisma.questions.update({
      where: { id: params.id },
      data:  { is_example: false },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/schedule/examples/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
