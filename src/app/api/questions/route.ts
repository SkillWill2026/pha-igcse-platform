import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const topicId       = searchParams.get('topic_id')
  const subtopicId    = searchParams.get('subtopic_id')
  const subSubtopicId = searchParams.get('sub_subtopic_id')

  try {
    const supabase = createAdminClient()

    // Flat fetch — no embedded joins until FK constraints are confirmed.
    // Reference tables (topics, subtopics, exam_boards, sub_subtopics) are
    // fetched separately and stitched by id.
    let query = supabase
      .from('questions')
      .select('*')
      .order('serial_number', { ascending: true })

    if (topicId       && topicId       !== '') query = query.eq('topic_id',        topicId)
    if (subtopicId    && subtopicId    !== '') query = query.eq('subtopic_id',     subtopicId)
    if (subSubtopicId && subSubtopicId !== '') query = query.eq('sub_subtopic_id', subSubtopicId)

    const { data, error } = await query
    if (error) {
      console.error('[GET /api/questions]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const rows = data ?? []

    // Collect unique FK ids for parallel reference fetches
    const topicIds     = [...new Set(rows.map((q: any) => q.topic_id).filter(Boolean))]
    const subtopicIds  = [...new Set(rows.map((q: any) => q.subtopic_id).filter(Boolean))]
    const boardIds     = [...new Set(rows.map((q: any) => q.exam_board_id).filter(Boolean))]
    const sstIds       = [...new Set(rows.map((q: any) => q.sub_subtopic_id).filter(Boolean))]

    const [topicsRes, subtopicsRes, boardsRes, sstRes] = await Promise.all([
      topicIds.length    > 0 ? supabase.from('topics').select('id, ref, name').in('id', topicIds) : { data: [] },
      subtopicIds.length > 0 ? supabase.from('subtopics').select('id, ref, title').in('id', subtopicIds) : { data: [] },
      boardIds.length    > 0 ? supabase.from('exam_boards').select('id, name').in('id', boardIds) : { data: [] },
      sstIds.length      > 0 ? supabase.from('sub_subtopics').select('id, ext_num, outcome, tier').in('id', sstIds) : { data: [] },
    ])

    const topicMap    = new Map((topicsRes.data    ?? []).map((r: any) => [r.id, r]))
    const subtopicMap = new Map((subtopicsRes.data ?? []).map((r: any) => [r.id, r]))
    const boardMap    = new Map((boardsRes.data    ?? []).map((r: any) => [r.id, r]))
    const sstMap      = new Map((sstRes.data       ?? []).map((r: any) => [r.id, r]))

    const questions = rows.map((q: any) => {
      const sub = subtopicMap.get(q.subtopic_id)
      return {
        ...q,
        exam_boards:   boardMap.get(q.exam_board_id)  ?? null,
        topics:        topicMap.get(q.topic_id)        ?? null,
        subtopics:     sub ? { id: q.subtopic_id, ref: sub.ref, name: sub.title ?? '' } : null,
        sub_subtopics: sstMap.get(q.sub_subtopic_id)  ?? null,
      }
    })

    return NextResponse.json(questions)
  } catch (err) {
    console.error('[GET /api/questions] unexpected:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
