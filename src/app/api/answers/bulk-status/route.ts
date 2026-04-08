import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json() as {
      ids: string[]
      status: 'approved' | 'rejected' | 'deleted'
    }

    const { ids, status } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids must be a non-empty array' }, { status: 400 })
    }

    if (!['approved', 'rejected', 'deleted'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('answers')
      .update({ status, updated_at: new Date().toISOString() })
      .in('id', ids)

    if (error) {
      console.error('[PATCH /api/answers/bulk-status]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ updated: ids.length })
  } catch (err) {
    console.error('[PATCH /api/answers/bulk-status] unexpected:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
