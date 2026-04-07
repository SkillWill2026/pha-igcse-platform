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

    // Use * so missing columns (e.g. sub_subtopic_id before 006c runs) don't break the query.
    // topics + subtopics embedded joins are safe — those FKs exist from the original schema.
    let query = supabase
      .from('questions')
      .select('*, topics(ref, name), subtopics(ref, title), exam_boards(id, name)')
      .order('created_at', { ascending: false })

    if (topicId       && topicId       !== '') query = query.eq('topic_id',        topicId)
    if (subtopicId    && subtopicId    !== '') query = query.eq('subtopic_id',     subtopicId)
    if (subSubtopicId && subSubtopicId !== '') query = query.eq('sub_subtopic_id', subSubtopicId)

    const { data, error } = await query
    if (error) {
      console.error('[GET /api/questions]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Stitch sub_subtopics separately — FK constraint may not exist yet
    const rows = data ?? []
    const sstIds = [...new Set(rows.flatMap((q: any) => q.sub_subtopic_id ? [q.sub_subtopic_id as string] : []))]
    const sstMap = new Map<string, any>()
    if (sstIds.length > 0) {
      const { data: sstData } = await supabase
        .from('sub_subtopics')
        .select('id, ext_num, outcome, tier')
        .in('id', sstIds)
      ;(sstData ?? []).forEach((s: any) => sstMap.set(s.id, s))
    }

    const questions = rows.map((q: any) => ({
      ...q,
      exam_boards:   q.exam_boards ?? null,
      topics:        q.topics      ?? null,
      subtopics:     q.subtopics   ? { id: q.subtopic_id, ref: q.subtopics.ref, name: q.subtopics.title ?? '' } : null,
      sub_subtopics: q.sub_subtopic_id ? (sstMap.get(q.sub_subtopic_id) ?? null) : null,
    }))

    return NextResponse.json(questions)
  } catch (err) {
    console.error('[GET /api/questions] unexpected:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
