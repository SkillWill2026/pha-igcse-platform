export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const record = await prisma.ppt_decks.findUnique({
      where: { id: params.id },
      select: { file_path: true, filename: true },
    })

    if (!record || !record.file_path) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Signed URL from Supabase Storage
    const supabase = createAdminClient()
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
    const record = await prisma.ppt_decks.findUnique({
      where: { id: params.id },
      select: { file_path: true },
    })

    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }

    // Remove from Supabase Storage if file_path exists
    if (record.file_path) {
      const supabase = createAdminClient()
      await supabase.storage.from('pptx-decks').remove([record.file_path])
    }

    await prisma.ppt_decks.delete({ where: { id: params.id } })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/schedule/ppt/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
