export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

// ── Helpers ──────────────────────────────────────────────────────────────────
const isValidUUID = (v: unknown): v is string =>
  typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)

// ── GET — recent batches for the filter dropdown ──────────────────────────────
export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('upload_batches')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error('[GET /api/upload-batch]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── POST — create a new batch record ─────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      topic_id?: string | null
      subtopic_id?: string | null
      sub_subtopic_id?: string | null
      total_files: number
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('upload_batches')
      .insert({
        topic_id:        isValidUUID(body.topic_id) ? body.topic_id : null,
        subtopic_id:     isValidUUID(body.subtopic_id) ? body.subtopic_id : null,
        sub_subtopic_id: isValidUUID(body.sub_subtopic_id) ? body.sub_subtopic_id : null,
        total_files:     body.total_files,
        status:          'processing',
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (err) {
    console.error('[POST /api/upload-batch]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── PATCH — update batch progress + final status ──────────────────────────────
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json() as {
      batch_id: string
      completed_files: number
      failed_files: number
      total_questions_extracted: number
      status: string
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('upload_batches')
      .update({
        completed_files:           body.completed_files,
        failed_files:              body.failed_files,
        total_questions_extracted: body.total_questions_extracted,
        status:                    body.status,
        completed_at:              new Date().toISOString(),
      })
      .eq('id', body.batch_id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (err) {
    console.error('[PATCH /api/upload-batch]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
