import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      question_id: string
      image_type: 'question' | 'answer'
      image_data: string
      source: 'function_plotter' | 'desmos'
    }

    const { question_id, image_type, image_data, source } = body

    if (!question_id || !image_type || !image_data) {
      return NextResponse.json(
        { error: 'Missing required fields: question_id, image_type, image_data' },
        { status: 400 }
      )
    }

    // Strip data URI prefix
    const base64Match = image_data.match(/^data:image\/png;base64,(.+)$/)
    if (!base64Match) {
      return NextResponse.json(
        { error: 'Invalid image data format — must be data:image/png;base64,...' },
        { status: 400 }
      )
    }

    const base64Data = base64Match[1]
    const buffer = Buffer.from(base64Data, 'base64')
    console.log('[graph/save] Processing image:', { question_id, image_type, source, size: buffer.length })

    // ── Upload to Supabase Storage (unchanged) ────────────────────────────────
    const supabase = createAdminClient()
    const fileName    = `${Date.now()}.png`
    const storagePath = `graph-images/${question_id}/${image_type}/${fileName}`

    try {
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('question-images')
        .upload(storagePath, buffer, { contentType: 'image/png', upsert: true })

      if (uploadErr) {
        console.error('[graph/save] Storage upload failed:', uploadErr.message)
        return NextResponse.json({ error: `Storage upload failed: ${uploadErr.message}` }, { status: 500 })
      }

      if (!uploadData?.path) {
        console.error('[graph/save] Upload succeeded but no path returned')
        return NextResponse.json({ error: 'Upload succeeded but no path returned' }, { status: 500 })
      }

      console.log('[graph/save] Uploaded to:', uploadData.path)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[graph/save] Storage exception:', msg)
      return NextResponse.json({ error: `Storage error: ${msg}` }, { status: 500 })
    }

    // Get public URL — Supabase Storage (unchanged)
    const { data: publicUrlData } = supabase.storage.from('question-images').getPublicUrl(storagePath)
    const imageUrl = publicUrlData?.publicUrl ?? ''

    // Generate signed URL — Supabase Storage (unchanged)
    const { data: signedUrlData } = await supabase.storage
      .from('question-images')
      .createSignedUrl(storagePath, 3600 * 24)
    const displayUrl = signedUrlData?.signedUrl ?? publicUrlData?.publicUrl ?? ''

    // Get max sort_order for this question + image_type
    try {
      const existing = await prisma.question_images.findFirst({
        where:   { question_id, image_type },
        select:  { sort_order: true },
        orderBy: { sort_order: 'desc' },
      })

      const newSortOrder = (existing?.sort_order ?? 0) + 1
      console.log('[graph/save] Next sort_order:', newSortOrder)

      // Insert into question_images table
      const insertData = await prisma.question_images.create({
        data: {
          id:           crypto.randomUUID(),
          question_id,
          storage_path: storagePath,
          image_type,
          sort_order:   newSortOrder,
          display_url:  displayUrl,
        },
        select: { id: true },
      })

      console.log('[graph/save] Success — image_id:', insertData.id)

      return NextResponse.json({
        success:      true,
        image_url:    imageUrl,
        display_url:  displayUrl,
        storage_path: storagePath,
        image_id:     insertData.id,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[graph/save] Database exception:', msg)
      return NextResponse.json({ error: `Database error: ${msg}` }, { status: 500 })
    }

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[POST /api/graph/save]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
