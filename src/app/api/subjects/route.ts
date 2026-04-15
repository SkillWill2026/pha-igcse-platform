export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET() {
  const serverSupabase = createServerClient()
  const { data: { user } } = await serverSupabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const adminClient = createAdminClient()
    const { data: subjects, error } = await adminClient
      .from('subjects')
      .select('id, name, code, color, active, sort_order')
      .eq('active', true)
      .order('sort_order')

    if (error) {
      console.error('[GET /api/subjects]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ subjects: subjects ?? [] })
  } catch (err) {
    console.error('[GET /api/subjects]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
