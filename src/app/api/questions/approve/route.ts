export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json() as { ids?: unknown }
    const { ids } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: '`ids` must be a non-empty array of question UUIDs' },
        { status: 400 },
      )
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('questions')
      .update({ status: 'approved' })
      .in('id', ids as string[])
      .select('id, serial_number')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const serials = (data ?? [])
      .map((r: any) => r.serial_number as string | null)
      .filter((s): s is string => s !== null)

    return NextResponse.json({ updated: data?.length ?? 0, serials })
  } catch (err) {
    console.error('[PATCH /api/questions/approve]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
