import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { exam_board_ids } = await request.json() as { exam_board_ids?: string[] }

    if (!exam_board_ids || exam_board_ids.length === 0) {
      return NextResponse.json({ error: 'exam_board_ids is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: source, error: srcErr } = await supabase
      .from('questions')
      .select('content_text, difficulty, question_type, marks, topic_id, subtopic_id, image_url, status, source_question_id')
      .eq('id', params.id)
      .single()

    if (srcErr || !source) {
      return NextResponse.json({ error: 'Source question not found' }, { status: 404 })
    }

    // ── Resolve root original (walk up the chain, max 10 hops) ───────────────
    let rootId = params.id
    let cursor = source.source_question_id
    for (let i = 0; i < 10 && cursor; i++) {
      const { data: ancestor } = await supabase
        .from('questions')
        .select('id, source_question_id')
        .eq('id', cursor)
        .single()
      if (!ancestor) break
      rootId = ancestor.id
      cursor = ancestor.source_question_id
    }

    // ── Find all board IDs already covered in this family ────────────────────
    const { data: family } = await supabase
      .from('questions')
      .select('exam_board_id')
      .or(`id.eq.${rootId},source_question_id.eq.${rootId}`)

    const coveredBoardIds = new Set(family?.map((f) => f.exam_board_id) ?? [])

    // ── Create copies only for boards not already covered ────────────────────
    const newBoardIds = exam_board_ids.filter((id) => !coveredBoardIds.has(id))

    if (newBoardIds.length === 0) {
      return NextResponse.json({ created: [] })
    }

    const copies = newBoardIds.map((board_id) => ({
      exam_board_id:      board_id,
      topic_id:           source.topic_id,
      subtopic_id:        source.subtopic_id,
      content_text:       source.content_text,
      image_url:          source.image_url,
      difficulty:         source.difficulty,
      question_type:      source.question_type,
      marks:              source.marks,
      status:             'approved' as const,
      ai_extracted:       false,
      source_question_id: rootId,
    }))

    const { data: created, error: insertErr } = await supabase
      .from('questions')
      .insert(copies)
      .select()

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }

    revalidatePath('/admin/questions', 'layout')
    return NextResponse.json({ created })
  } catch (err) {
    console.error(`[POST /api/questions/${params.id}/copy-to-boards]`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
