export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const [rejectedRes, deletedRes] = await Promise.all([
      supabase.from('questions').select('id', { count: 'exact', head: true }).eq('status', 'rejected'),
      supabase.from('questions').select('id', { count: 'exact', head: true }).eq('status', 'deleted'),
    ])
    return NextResponse.json({
      rejected: rejectedRes.count ?? 0,
      deleted: deletedRes.count ?? 0,
    })
  } catch (err) {
    console.error('[GET /api/questions/counts]', err)
    return NextResponse.json({ rejected: 0, deleted: 0 })
  }
}
