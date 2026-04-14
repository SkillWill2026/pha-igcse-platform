export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData   = await request.formData()
    const file       = formData.get('file') as File | null
    const subtopicId = formData.get('subtopic_id') as string | null
    const topicRef   = formData.get('topic_ref') as string | null
    const subtopicRef = formData.get('subtopic_ref') as string | null

    if (!file || !subtopicId || !topicRef) {
      return NextResponse.json({ error: 'file, subtopic_id and topic_ref are required' }, { status: 400 })
    }

    if (!file.name.toLowerCase().endsWith('.pptx')) {
      return NextResponse.json({ error: 'Only .pptx files are accepted' }, { status: 400 })
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds 50 MB limit' }, { status: 400 })
    }

    const supabase  = createAdminClient()
    const safeName  = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const folderRef = subtopicRef ? `${topicRef}/${subtopicRef}` : topicRef
    const filePath  = `${folderRef}/${safeName}`

    const buffer = Buffer.from(await file.arrayBuffer())

    // Storage stays on Supabase
    const { error: storageErr } = await supabase.storage
      .from('pptx-decks')
      .upload(filePath, buffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        upsert: true,
      })

    if (storageErr) {
      return NextResponse.json({ error: storageErr.message }, { status: 500 })
    }

    // DB record → Prisma/Azure
    let record
    try {
      record = await prisma.ppt_decks.create({
        data: {
          subtopic_id: subtopicId,
          filename:    file.name,
          file_path:   filePath,
          file_size:   file.size,
        },
      })
    } catch (dbErr) {
      // Clean up storage on DB failure
      await supabase.storage.from('pptx-decks').remove([filePath])
      console.error('[POST /api/schedule/ppt] DB insert failed:', dbErr)
      return NextResponse.json({ error: 'Failed to save record' }, { status: 500 })
    }

    return NextResponse.json({ ppt_deck: record })
  } catch (err) {
    console.error('[POST /api/schedule/ppt]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
