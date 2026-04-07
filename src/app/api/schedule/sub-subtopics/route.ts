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

    const { subtopic_id, ext_num, core_num, outcome, tier, notes } = body as {
      subtopic_id: string
      ext_num: number
      core_num?: number | null
      outcome: string
      tier?: string
      notes?: string[] | null
    }

    if (!subtopic_id || !ext_num || !outcome) {
      return NextResponse.json(
        { error: 'Missing required fields: subtopic_id, ext_num, outcome' },
        { status: 400 },
      )
    }

    // Auto-assign sort_order as count+1 within the subtopic
    const { count } = await supabase
      .from('sub_subtopics')
      .select('*', { count: 'exact', head: true })
      .eq('subtopic_id', subtopic_id)

    const sort_order = (count ?? 0) + 1

    const { data, error } = await supabase
      .from('sub_subtopics')
      .insert({
        subtopic_id,
        ext_num: Number(ext_num),
        core_num: core_num != null ? Number(core_num) : null,
        outcome,
        tier: tier ?? 'both',
        notes: notes ?? null,
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
