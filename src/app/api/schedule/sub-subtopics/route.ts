import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const subtopicId = searchParams.get('subtopic_id')

    let query = supabase
      .from('sub_subtopics')
      .select('*')
      .order('sort_order')

    if (subtopicId) {
      query = query.eq('subtopic_id', subtopicId)
    }

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ sub_subtopics: data ?? [] })
  } catch (err) {
    console.error('[GET /api/schedule/sub-subtopics]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json() as Record<string, unknown>

    const {
      subtopic_id,
      ref,
      title,
      syllabus_code,
      mcq_count,
      short_ans_count,
      structured_count,
      extended_count,
      qs_total,
    } = body as {
      subtopic_id: string
      ref: string
      title: string
      syllabus_code?: string
      mcq_count: number
      short_ans_count: number
      structured_count: number
      extended_count: number
      qs_total?: number
    }

    if (!subtopic_id || !ref || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: subtopic_id, ref, title' },
        { status: 400 },
      )
    }

    // Auto-assign sort_order as count+1 within the subtopic
    const { count } = await supabase
      .from('sub_subtopics')
      .select('*', { count: 'exact', head: true })
      .eq('subtopic_id', subtopic_id)

    const sort_order = (count ?? 0) + 1
    const computed_qs_total =
      qs_total ??
      ((Number(mcq_count) || 0) +
        (Number(short_ans_count) || 0) +
        (Number(structured_count) || 0) +
        (Number(extended_count) || 0))

    const { data, error } = await supabase
      .from('sub_subtopics')
      .insert({
        subtopic_id,
        ref,
        title,
        syllabus_code: syllabus_code ?? null,
        mcq_count: Number(mcq_count) || 0,
        short_ans_count: Number(short_ans_count) || 0,
        structured_count: Number(structured_count) || 0,
        extended_count: Number(extended_count) || 0,
        qs_total: computed_qs_total,
        sort_order,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ sub_subtopic: data })
  } catch (err) {
    console.error('[POST /api/schedule/sub-subtopics]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
