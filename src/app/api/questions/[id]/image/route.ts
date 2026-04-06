import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

const BUCKET = 'question-images'

// ── Ensure the storage bucket exists ─────────────────────────────────────────
async function ensureBucket(supabase: ReturnType<typeof createAdminClient>) {
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.find((b) => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true })
  }
}

// ── POST — upload image ───────────────────────────────────────────────────────
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
    const allowed = ['jpg', 'jpeg', 'png', 'pdf']
    if (!allowed.includes(ext)) {
      return NextResponse.json(
        { error: 'Only JPG, PNG, or PDF files are supported' },
        { status: 400 },
      )
    }

    const supabase = createAdminClient()
    await ensureBucket(supabase)

    // Remove any existing image for this question first
    await supabase.storage.from(BUCKET).remove([`${params.id}/`])

    const path = `${params.id}/image.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type || `image/${ext}`,
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)

    // Persist the URL to the questions table
    console.log(`[image POST] writing image_url to DB — question: ${params.id}, url: ${publicUrl}`)
    const { error: dbError } = await supabase
      .from('questions')
      .update({ image_url: publicUrl })
      .eq('id', params.id)

    console.log(`[image POST] DB write result — error: ${dbError?.message ?? 'none'}`)
    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    revalidatePath('/admin/questions', 'layout')
    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    console.error(`[POST /api/questions/${params.id}/image]`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── DELETE — remove image ─────────────────────────────────────────────────────
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = createAdminClient()

    // List and delete all files under this question's folder
    const { data: files } = await supabase.storage
      .from(BUCKET)
      .list(params.id)

    if (files && files.length > 0) {
      const paths = files.map((f) => `${params.id}/${f.name}`)
      await supabase.storage.from(BUCKET).remove(paths)
    }

    // Clear the URL in the DB
    const { error: dbError } = await supabase
      .from('questions')
      .update({ image_url: null })
      .eq('id', params.id)

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    revalidatePath('/admin/questions', 'layout')
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(`[DELETE /api/questions/${params.id}/image]`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
