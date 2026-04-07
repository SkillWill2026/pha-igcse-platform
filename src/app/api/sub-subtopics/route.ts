import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const subtopicId = request.nextUrl.searchParams.get('subtopic_id')
  if (!subtopicId) return NextResponse.json([])
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('sub_subtopics')
    .select('id, ext_num, core_num, outcome, tier, sort_order')
    .eq('subtopic_id', subtopicId)
    .order('ext_num')
  if (error) return NextResponse.json([], { status: 500 })
  return NextResponse.json(data)
}
