export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      topic_id: string
      ref: string
      title: string
      due_date: string | null
      sprint_week: number | null
      qs_total: number
      mcq_count: number
      short_ans_count: number
      structured_count: number
      extended_count: number
      status: string
    }

    if (!body.topic_id || !body.title) {
      return NextResponse.json({ error: 'topic_id and title are required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { count } = await supabase
      .from('subtopics')
      .select('*', { count: 'exact', head: true })
      .eq('topic_id', body.topic_id)
    const sort_order = (count ?? 0) + 1

    const { data, error } = await supabase
      .from('subtopics')
      .insert({ ...body, sort_order })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ subtopic: data })
  } catch (err) {
    console.error('[POST /api/schedule/subtopics]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
