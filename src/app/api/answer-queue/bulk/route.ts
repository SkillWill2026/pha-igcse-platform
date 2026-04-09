export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createAdminClient()
  const body = await request.json()
  const { ids, status } = body

  if (!ids?.length || !status) {
    return NextResponse.json({ error: 'Missing ids or status' }, { status: 400 })
  }

  const { error } = await supabase
    .from('answers')
    .update({ status })
    .in('id', ids)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ updated: ids.length })
}
