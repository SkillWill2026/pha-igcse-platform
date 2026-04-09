export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const topicId = request.nextUrl.searchParams.get('topic_id')
  if (!topicId) return NextResponse.json([])
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('subtopics')
    .select('id, ref, title, tier, topic_id')
    .eq('topic_id', topicId)
    .order('sort_order')
  if (error) return NextResponse.json([], { status: 500 })
  return NextResponse.json(data)
}
