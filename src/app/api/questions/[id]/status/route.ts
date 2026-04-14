export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json() as { status: 'approved' | 'rejected' | 'deleted' }
    const { status } = body

    if (!['approved', 'rejected', 'deleted'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update the question
    const questionData = await prisma.questions.update({
      where: { id: params.id },
      data: { status, updated_at: new Date() },
      select: { serial_number: true },
    }).catch((err) => {
      console.error('[PATCH /api/questions/[id]/status] question error:', err)
      throw err
    })

    // Mirror status to linked answer (non-fatal)
    let answerSerial: string | null = null
    try {
      await prisma.answers.updateMany({
        where: { question_id: params.id },
        data: { status, updated_at: new Date() },
      })
      const answer = await prisma.answers.findFirst({
        where: { question_id: params.id },
        select: { serial_number: true },
      })
      answerSerial = answer?.serial_number ?? null
    } catch (answerErr) {
      console.error('[PATCH /api/questions/[id]/status] answer error:', answerErr)
      // Non-fatal
    }

    return NextResponse.json({
      question_serial: questionData?.serial_number ?? null,
      answer_serial: answerSerial,
    })
  } catch (err) {
    console.error('[PATCH /api/questions/[id]/status] unexpected:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
