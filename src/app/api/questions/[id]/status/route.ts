import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

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

    const supabase = createAdminClient()

    // Update the question
    const { data: questionData, error: questionError } = await supabase
      .from('questions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select('serial_number')
      .single()

    if (questionError) {
      console.error('[PATCH /api/questions/[id]/status] question error:', questionError)
      return NextResponse.json({ error: questionError.message }, { status: 500 })
    }

    // Mirror status to linked answer
    const { data: answerData, error: answerError } = await supabase
      .from('answers')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('question_id', params.id)
      .select('serial_number')
      .maybeSingle()

    if (answerError) {
      console.error('[PATCH /api/questions/[id]/status] answer error:', answerError)
      // Non-fatal
    }

    return NextResponse.json({
      question_serial: questionData?.serial_number ?? null,
      answer_serial: answerData?.serial_number ?? null,
    })
  } catch (err) {
    console.error('[PATCH /api/questions/[id]/status] unexpected:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
