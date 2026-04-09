import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createAdminClient()

  const [answersRes, topicsRes, subtopicsRes] = await Promise.all([
    supabase
      .from('answers')
      .select(`
        id,
        serial,
        content,
        confidence_score,
        status,
        created_at,
        question_id,
        questions (
          id,
          serial_number,
          content_text,
          status,
          topic_id,
          subtopic_id
        )
      `)
      .in('status', ['approved', 'draft'])
      .or('confidence_score.lt.0.7,confidence_score.is.null')
      .order('confidence_score', { ascending: true, nullsFirst: true })
      .limit(200),
    supabase.from('topics').select('id, name, ref'),
    supabase.from('subtopics').select('id, title'),
  ])

  if (answersRes.error) {
    console.error('Answer queue fetch error:', answersRes.error)
    return NextResponse.json({ error: answersRes.error.message }, { status: 500 })
  }

  const topicMap = Object.fromEntries(
    (topicsRes.data ?? []).map(t => [t.id, t])
  )
  const subtopicMap = Object.fromEntries(
    (subtopicsRes.data ?? []).map(s => [s.id, s])
  )

  const answers = (answersRes.data ?? []).map(a => ({
    ...a,
    questions: a.questions
      ? {
          ...a.questions,
          topics: topicMap[(a.questions as any).topic_id] ?? null,
          subtopics: subtopicMap[(a.questions as any).subtopic_id] ?? null,
        }
      : null,
  }))

  return NextResponse.json({ answers })
}
