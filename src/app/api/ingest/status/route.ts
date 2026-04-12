import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/ingest/status?batch_id=<uuid>
// Lightweight poll endpoint — reads upload_batches row for live status
export async function GET(request: NextRequest) {
  const batch_id = request.nextUrl.searchParams.get('batch_id')

  if (!batch_id) {
    return NextResponse.json({ error: 'batch_id required' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('upload_batches')
    .select('id, status, questions_extracted, total_questions, error_message, source_file_name')
    .eq('id', batch_id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
