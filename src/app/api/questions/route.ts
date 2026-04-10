export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
const { searchParams } = request.nextUrl
  const topicId       = searchParams.get('topic_id')
  const subtopicId    = searchParams.get('subtopic_id')
  const subSubtopicId = searchParams.get('sub_subtopic_id')
  const batchId       = searchParams.get('batch_id')
  const statusParam   = searchParams.get('status')
  const subjectId     = searchParams.get('subject_id')

  try {
    const supabase = createAdminClient()

    let query = supabase
      .from('questions')
      .select('*')
      .order('serial_number', { ascending: true })

    // Status filtering: default to active (draft+approved), or filter by explicit status
    if (statusParam === 'rejected') {
      query = query.eq('status', 'rejected')
    } else if (statusParam === 'deleted') {
      query = query.eq('status', 'deleted')
    } else if (statusParam === 'all') {
      // no status filter
    } else {
      // Default: only active questions
      query = query.in('status', ['draft', 'approved'])
    }

    // If subject_id given but no topic_id, scope questions to that subject's topics
    if (subjectId && (!topicId || topicId === '')) {
      const { data: subjectTopics } = await supabase
        .from('topics')
        .select('id')
        .eq('subject_id', subjectId)
      const subjectTopicIds = (subjectTopics ?? []).map((t: { id: string }) => t.id)
      if (subjectTopicIds.length === 0) {
        // Subject exists but has no topics yet — return empty result immediately
        return NextResponse.json([])
      }
      query = query.in('topic_id', subjectTopicIds)
    }

    if (topicId       && topicId       !== '') query = query.eq('topic_id',        topicId)
    if (subtopicId    && subtopicId    !== '') query = query.eq('subtopic_id',     subtopicId)
    if (subSubtopicId && subSubtopicId !== '') query = query.eq('sub_subtopic_id', subSubtopicId)
    if (batchId       && batchId       !== '') query = query.eq('batch_id',        batchId)

    const { data, error } = await query
    if (error) {
      console.error('[GET /api/questions]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const rows = data ?? []

    // Collect unique FK ids for parallel reference fetches
    const questionIds  = rows.map((q: any) => q.id)
    const topicIds     = [...new Set(rows.map((q: any) => q.topic_id).filter(Boolean))]
    const subtopicIds  = [...new Set(rows.map((q: any) => q.subtopic_id).filter(Boolean))]
    const boardIds     = [...new Set(rows.map((q: any) => q.exam_board_id).filter(Boolean))]
    const sstIds       = [...new Set(rows.map((q: any) => q.sub_subtopic_id).filter(Boolean))]

    const [topicsRes, subtopicsRes, boardsRes, sstRes, answersRes] = await Promise.all([
      topicIds.length    > 0 ? supabase.from('topics').select('id, ref, name').in('id', topicIds) : { data: [] },
      subtopicIds.length > 0 ? supabase.from('subtopics').select('id, ref, title').in('id', subtopicIds) : { data: [] },
      boardIds.length    > 0 ? supabase.from('exam_boards').select('id, name').in('id', boardIds) : { data: [] },
      sstIds.length      > 0 ? supabase.from('sub_subtopics').select('id, ext_num, outcome, tier').in('id', sstIds) : { data: [] },
      questionIds.length > 0
        ? supabase.from('answers').select('question_id, serial_number, status').in('question_id', questionIds)
        : { data: [] },
    ])

    const topicMap    = new Map((topicsRes.data    ?? []).map((r: any) => [r.id, r]))
    const subtopicMap = new Map((subtopicsRes.data ?? []).map((r: any) => [r.id, r]))
    const boardMap    = new Map((boardsRes.data    ?? []).map((r: any) => [r.id, r]))
    const sstMap      = new Map((sstRes.data       ?? []).map((r: any) => [r.id, r]))
    // Map question_id → first answer found
    const answerMap   = new Map<string, { serial_number: string | null; status: string }>()
    for (const a of (answersRes.data ?? [])) {
      if (!answerMap.has((a as any).question_id)) {
        answerMap.set((a as any).question_id, {
          serial_number: (a as any).serial_number ?? null,
          status: (a as any).status ?? 'draft',
        })
      }
    }

    const questions = rows.map((q: any) => {
      const sub    = subtopicMap.get(q.subtopic_id)
      const answer = answerMap.get(q.id)
      return {
        ...q,
        exam_boards:   boardMap.get(q.exam_board_id)  ?? null,
        topics:        topicMap.get(q.topic_id)        ?? null,
        subtopics:     sub ? { id: q.subtopic_id, ref: sub.ref, name: sub.title ?? '' } : null,
        sub_subtopics: sstMap.get(q.sub_subtopic_id)  ?? null,
        answer_serial: answer?.serial_number ?? null,
        answer_status: answer?.status ?? null,
      }
    })

    return NextResponse.json(questions)
  } catch (err) {
    console.error('[GET /api/questions] unexpected:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
