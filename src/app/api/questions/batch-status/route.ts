export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json() as {
      question_ids: string[]
      status: 'approved' | 'rejected' | 'deleted'
    }

    const { question_ids, status } = body

    if (!Array.isArray(question_ids) || question_ids.length === 0) {
      return NextResponse.json({ error: 'question_ids must be a non-empty array' }, { status: 400 })
    }

    if (!['approved', 'rejected', 'deleted'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const now = new Date()
    const [questionsResult, answersResult] = await Promise.allSettled([
      prisma.questions.updateMany({
        where: { id: { in: question_ids } },
        data: { status, updated_at: now },
      }),
      prisma.answers.updateMany({
        where: { question_id: { in: question_ids } },
        data: { status, updated_at: now },
      }),
    ])

    if (questionsResult.status === 'rejected') {
      console.error('[PATCH /api/questions/batch-status] questions error:', questionsResult.reason)
      return NextResponse.json({ error: 'Failed to update questions' }, { status: 500 })
    }

    if (answersResult.status === 'rejected') {
      console.error('[PATCH /api/questions/batch-status] answers error:', answersResult.reason)
      // Non-fatal: answers may not exist for every question
    }

    return NextResponse.json({ updated: question_ids.length })
  } catch (err) {
    console.error('[PATCH /api/questions/batch-status] unexpected:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
