export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = createAdminClient()

    const { data: record, error: fetchErr } = await supabase
      .from('ppt_decks')
      .select('file_path, filename')
      .eq('id', params.id)
      .single()

    if (fetchErr || !record) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const { data: signedData, error: signErr } = await supabase.storage
      .from('pptx-decks')
      .createSignedUrl(record.file_path, 60 * 60) // 1 hour

    if (signErr || !signedData) {
      return NextResponse.json({ error: signErr?.message ?? 'Failed to create URL' }, { status: 500 })
    }

    return NextResponse.json({ url: signedData.signedUrl, filename: record.filename })
  } catch (err) {
    console.error('[GET /api/schedule/ppt/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = createAdminClient()

    const { data: record, error: fetchErr } = await supabase
      .from('ppt_decks')
      .select('file_path')
      .eq('id', params.id)
      .single()

    if (fetchErr || !record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }

    await supabase.storage.from('pptx-decks').remove([record.file_path])

    const { error: dbErr } = await supabase
      .from('ppt_decks')
      .delete()
      .eq('id', params.id)

    if (dbErr) {
      return NextResponse.json({ error: dbErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/schedule/ppt/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
