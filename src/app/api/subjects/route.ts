export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const serverSupabase = createServerClient()
  const { data: { user } } = await serverSupabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('subjects')
    .select('id, name, code, color, active, sort_order')
    .eq('active', true)
    .order('sort_order')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ subjects: data })
}
