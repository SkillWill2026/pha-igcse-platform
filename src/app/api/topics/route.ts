import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('topics')
    .select('id, ref, name')
    .order('sort_order')
  if (error) return NextResponse.json([], { status: 500 })
  return NextResponse.json(data)
}
