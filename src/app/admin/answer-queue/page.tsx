import { unstable_noStore } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import { AnswerQueueClient } from '@/components/admin/AnswerQueueClient'

export const dynamic = 'force-dynamic'

export default async function AnswerQueuePage() {
  unstable_noStore()

  let answers: unknown[] = []
  let error: string | null = null

  try {
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
      error = answersRes.error.message
    } else {
      const topicMap = Object.fromEntries(
        (topicsRes.data ?? []).map(t => [t.id, t])
      )
      const subtopicMap = Object.fromEntries(
        (subtopicsRes.data ?? []).map(s => [s.id, s])
      )
      answers = (answersRes.data ?? []).map(a => ({
        ...a,
        questions: a.questions
          ? {
              ...a.questions,
              topics: topicMap[(a.questions as any).topic_id] ?? null,
              subtopics: subtopicMap[(a.questions as any).subtopic_id] ?? null,
            }
          : null,
      }))
    }
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error'
  }

  return <AnswerQueueClient initialAnswers={answers} initialError={error} />
}
