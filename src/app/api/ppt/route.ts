export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subtopic_id = searchParams.get('subtopic_id')
    const subject_id = searchParams.get('subject_id')

    const supabase = createAdminClient()
    let query = supabase
      .from('ppt_decks')
      .select('id, title, status, subtopic_id, subject_id, created_at, updated_at, tutor_notes')
      .order('created_at', { ascending: false })

    if (subtopic_id) query = query.eq('subtopic_id', subtopic_id)
    if (subject_id) query = query.eq('subject_id', subject_id)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ decks: data ?? [] })
  } catch (err) {
    console.error('[GET /api/ppt]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
