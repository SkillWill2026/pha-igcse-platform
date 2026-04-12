import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

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

    const supabase = createAdminClient()

    // Upload to storage
    const fileName = `${Date.now()}.png`
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

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('question-images')
      .getPublicUrl(storagePath)

    const imageUrl = publicUrlData?.publicUrl ?? ''
    console.log('[graph/save] Public URL:', imageUrl)

    // Generate a signed URL so the thumbnail appears immediately
    const { data: signedUrlData } = await supabase.storage
      .from('question-images')
      .createSignedUrl(storagePath, 3600 * 24)  // 24h signed URL

    const displayUrl = signedUrlData?.signedUrl ?? publicUrlData?.publicUrl ?? ''
    console.log('[graph/save] Display URL:', displayUrl)

    // Get max sort_order for this question + image_type
    try {
      const { data: existing, error: queryErr } = await supabase
        .from('question_images')
        .select('sort_order')
        .eq('question_id', question_id)
        .eq('image_type', image_type)
        .order('sort_order', { ascending: false })
        .limit(1)

      if (queryErr) {
        console.error('[graph/save] Query existing images failed:', queryErr.message)
        return NextResponse.json({ error: `Query failed: ${queryErr.message}` }, { status: 500 })
      }

      const maxSortOrder = existing && existing.length > 0 ? existing[0].sort_order : 0
      const newSortOrder = maxSortOrder + 1

      console.log('[graph/save] Next sort_order:', newSortOrder)

      // Insert into question_images table
      const { data: insertData, error: insertErr } = await supabase
        .from('question_images')
        .insert({
          question_id,
          storage_path: storagePath,
          image_type,
          sort_order: newSortOrder,
          display_url: displayUrl,
        })
        .select('id')
        .single()

      if (insertErr) {
        console.error('[graph/save] Insert failed:', insertErr.message)
        return NextResponse.json({ error: `Insert failed: ${insertErr.message}` }, { status: 500 })
      }

      const imageId = insertData?.id

      console.log('[graph/save] Success — image_id:', imageId)

      return NextResponse.json({
        success: true,
        image_url: imageUrl,
        display_url: displayUrl,
        storage_path: storagePath,
        image_id: imageId,
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
