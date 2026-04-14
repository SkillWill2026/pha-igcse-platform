export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { createAdminClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

const IMAGE_BUCKET = 'question-images'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Collect all question IDs in the family (root + all chained descendants)
    const allIds: string[] = [params.id]
    let frontier: string[] = [params.id]
    for (let depth = 0; depth < 10; depth++) {
      const descendants = await prisma.questions.findMany({
        where: { source_question_id: { in: frontier } },
        select: { id: true },
      })
      if (descendants.length === 0) break
      const newIds = descendants.map(d => d.id)
      allIds.push(...newIds)
      frontier = newIds
    }

    // Delete storage images for every question in the family
    const family = await prisma.questions.findMany({
      where: { id: { in: allIds } },
      select: { id: true, image_url: true },
    })

    const supabase = createAdminClient()
    for (const q of family) {
      if (!q.image_url) continue
      const { data: files } = await supabase.storage.from(IMAGE_BUCKET).list(q.id)
      if (files && files.length > 0) {
        await supabase.storage.from(IMAGE_BUCKET).remove(files.map(f => `${q.id}/${f.name}`))
      }
    }

    // Delete all questions — answers cascade automatically (ON DELETE CASCADE)
    await prisma.questions.deleteMany({ where: { id: { in: allIds } } })

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
    const allowed = ['content_text', 'difficulty', 'question_type', 'marks', 'status', 'image_url', 'subtopic_id', 'topic_id', 'sub_subtopic_id']
    const updates: Record<string, unknown> = {}

    for (const key of allowed) {
      if (key in body) updates[key] = body[key]
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    console.log(`[PATCH /api/questions/${params.id}] updates:`, JSON.stringify(updates))
    const data = await prisma.questions.update({
      where: { id: params.id },
      data: updates as Prisma.questionsUpdateInput,
    })
    console.log(`[PATCH /api/questions/${params.id}] result — id: ${data.id}, image_url: ${(data as Record<string,unknown>).image_url ?? 'missing'}`)

    revalidatePath('/admin/questions', 'layout')
    return NextResponse.json(data)
  } catch (err) {
    console.error(`[PATCH /api/questions/${params.id}]`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
