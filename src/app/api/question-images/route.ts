export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

const BUCKET = 'question-images'

// ── GET ?question_id=X&image_type=Y ──────────────────────────────────────────
export async function GET(request: NextRequest) {
  const questionId = request.nextUrl.searchParams.get('question_id')
  const imageType  = request.nextUrl.searchParams.get('image_type')
  if (!questionId) {
    return NextResponse.json({ error: 'question_id is required' }, { status: 400 })
  }

  try {
    const rows = await prisma.question_images.findMany({
      where: {
        question_id: questionId,
        ...(imageType ? { image_type: imageType } : {}),
      },
      orderBy: { sort_order: 'asc' },
    })

    // Generate signed URLs — Supabase Storage (unchanged)
    const supabase = createAdminClient()
    const withSignedUrls = await Promise.all(
      rows.map(async (image) => {
        const { data: signedUrl } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(image.storage_path, 3600)
        return { ...image, display_url: signedUrl?.signedUrl ?? null }
      }),
    )

    return NextResponse.json(withSignedUrls)
  } catch (err) {
    console.error('[GET /api/question-images]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── POST (multipart: question_id, image_type?, file(s)) ──────────────────────
export async function POST(request: NextRequest) {
  try {
    const formData  = await request.formData()
    const questionId = formData.get('question_id') as string | null
    const imageType  = (formData.get('image_type') as string | null) ?? 'question'

    if (!questionId) {
      return NextResponse.json({ error: 'question_id is required' }, { status: 400 })
    }

    const files = formData.getAll('file') as File[]
    if (files.length === 0) {
      return NextResponse.json({ error: 'At least one file is required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const created = []

    for (let index = 0; index < files.length; index++) {
      const file      = files[index]
      const timestamp = Date.now()
      const safeName  = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const storagePath = `${questionId}/${timestamp}_${safeName}`

      const buffer = Buffer.from(await file.arrayBuffer())

      // Upload to Supabase Storage (unchanged)
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, buffer, { contentType: file.type, upsert: false })

      if (uploadError) {
        console.error('[POST /api/question-images] storage upload error:', uploadError)
        return NextResponse.json({ error: uploadError.message }, { status: 500 })
      }

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
      const publicUrl = urlData?.publicUrl ?? null

      const row = await prisma.question_images.create({
        data: {
          id:           crypto.randomUUID(),
          question_id:  questionId,
          storage_path: storagePath,
          public_url:   publicUrl,
          image_type:   imageType,
          sort_order:   index,
        },
      })

      created.push(row)
    }

    return NextResponse.json(created)
  } catch (err) {
    console.error('[POST /api/question-images]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── DELETE ?id=X ──────────────────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  try {
    const row = await prisma.question_images.findUnique({
      where: { id },
      select: { storage_path: true },
    })

    if (!row) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Remove from Supabase Storage (unchanged)
    const supabase = createAdminClient()
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([row.storage_path])

    if (storageError) {
      console.error('[DELETE /api/question-images] storage remove error:', storageError)
      // Continue to delete DB row even if storage fails
    }

    await prisma.question_images.delete({ where: { id } })

    return NextResponse.json({ deleted: id })
  } catch (err) {
    console.error('[DELETE /api/question-images]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
