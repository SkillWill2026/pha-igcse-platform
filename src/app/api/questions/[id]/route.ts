import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

const IMAGE_BUCKET = 'question-images'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = createAdminClient()

    // Collect all question IDs in the family (root + all chained descendants)
    const allIds: string[] = [params.id]
    let frontier: string[] = [params.id]
    for (let depth = 0; depth < 10; depth++) {
      const { data } = await supabase
        .from('questions')
        .select('id')
        .in('source_question_id', frontier)
      if (!data || data.length === 0) break
      const newIds = data.map((d) => d.id)
      allIds.push(...newIds)
      frontier = newIds
    }

    // Delete storage images for every question in the family
    const { data: family } = await supabase
      .from('questions')
      .select('id, image_url')
      .in('id', allIds)

    for (const q of family ?? []) {
      if (!q.image_url) continue
      const { data: files } = await supabase.storage.from(IMAGE_BUCKET).list(q.id)
      if (files && files.length > 0) {
        await supabase.storage
          .from(IMAGE_BUCKET)
          .remove(files.map((f) => `${q.id}/${f.name}`))
      }
    }

    // Delete all questions — answers cascade automatically (ON DELETE CASCADE)
    const { error: delErr } = await supabase
      .from('questions')
      .delete()
      .in('id', allIds)

    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 })

    revalidatePath('/admin/questions', 'layout')
    return NextResponse.json({ ok: true, deleted: allIds.length })
  } catch (err) {
    console.error(`[DELETE /api/questions/${params.id}]`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json() as Record<string, unknown>
    const allowed = ['content_text', 'difficulty', 'question_type', 'marks', 'status', 'image_url']
    const updates: Record<string, unknown> = {}

    for (const key of allowed) {
      if (key in body) updates[key] = body[key]
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const supabase = createAdminClient()
    console.log(`[PATCH /api/questions/${params.id}] updates:`, JSON.stringify(updates))
    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()
    console.log(`[PATCH /api/questions/${params.id}] result — id: ${data?.id ?? null}, image_url: ${(data as Record<string,unknown>)?.image_url ?? 'missing'}, error: ${error?.message ?? 'none'}`)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    revalidatePath('/admin/questions', 'layout')
    return NextResponse.json(data)
  } catch (err) {
    console.error(`[PATCH /api/questions/${params.id}]`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
