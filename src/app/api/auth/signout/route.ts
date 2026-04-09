export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export const runtime = 'nodejs'

export async function POST() {
  const supabase = createServerClient()
  await supabase.auth.signOut()
  return NextResponse.json({ ok: true })
}
