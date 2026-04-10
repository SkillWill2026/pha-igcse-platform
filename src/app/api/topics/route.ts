export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const serverSupabase = createServerClient()
  const { data: { user } } = await serverSupabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const subjectId = request.nextUrl.searchParams.get('subject_id')

  let query = supabase
    .from('topics')
    .select('id, ref, name, subject_id')
    .order('sort_order')

  if (subjectId) query = query.eq('subject_id', subjectId)

  const { data, error } = await query
  if (error) return NextResponse.json([], { status: 500 })
  return NextResponse.json(data)
}
