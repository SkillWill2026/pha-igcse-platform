export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subtopicId = searchParams.get('subtopic_id')

    if (!subtopicId) {
      return NextResponse.json({ error: 'subtopic_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('sub_subtopics')
      .select('id, ext_num, core_num, outcome, tier, sort_order')
      .eq('subtopic_id', subtopicId)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('[sub-subtopics] Supabase error:', JSON.stringify(error))
      return NextResponse.json({
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      }, { status: 500 })
    }

    return NextResponse.json(data ?? [])

  } catch (err) {
    console.error('[sub-subtopics] Caught error:', err)
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}
