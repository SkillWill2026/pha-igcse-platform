import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

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

    const supabase = createAdminClient()

    const [questionsRes, answersRes] = await Promise.all([
      supabase
        .from('questions')
        .update({ status, updated_at: new Date().toISOString() })
        .in('id', question_ids),
      supabase
        .from('answers')
        .update({ status, updated_at: new Date().toISOString() })
        .in('question_id', question_ids),
    ])

    if (questionsRes.error) {
      console.error('[PATCH /api/questions/batch-status] questions error:', questionsRes.error)
      return NextResponse.json({ error: questionsRes.error.message }, { status: 500 })
    }

    if (answersRes.error) {
      console.error('[PATCH /api/questions/batch-status] answers error:', answersRes.error)
      // Non-fatal: answers may not exist for every question
    }

    return NextResponse.json({ updated: question_ids.length })
  } catch (err) {
    console.error('[PATCH /api/questions/batch-status] unexpected:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
