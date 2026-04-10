import { unstable_noStore } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import { AnswerQueueClient } from '@/components/admin/AnswerQueueClient'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: { subject?: string }
}

export default async function AnswerQueuePage({ searchParams }: PageProps) {
  unstable_noStore()
  const subjectCode = searchParams.subject ?? '0580'

  let answers: unknown[] = []
  let error: string | null = null

  try {
    const supabase = createAdminClient()

    // Resolve subject → topic IDs
    const subjectRes = await supabase
      .from('subjects')
      .select('id')
      .eq('code', subjectCode)
      .single()

    const subjectId = subjectRes.data?.id ?? null
    let topicIds: string[] = []

    if (subjectId) {
      const { data: topicsData } = await supabase
        .from('topics')
        .select('id')
        .eq('subject_id', subjectId)
      topicIds = (topicsData ?? []).map((t) => t.id)
    }

    // Get question IDs for this subject's topics
    let questionIds: string[] | null = null
    if (topicIds.length > 0) {
      const { data: subjectQs } = await supabase
        .from('questions')
        .select('id')
        .in('topic_id', topicIds)
      questionIds = (subjectQs ?? []).map((q) => q.id)
    }

    // If subject has topics but no questions yet — return empty
    if (topicIds.length > 0 && questionIds !== null && questionIds.length === 0) {
      return <AnswerQueueClient key={subjectCode} initialAnswers={[]} initialError={null} />
    }

    const [answersRes, topicsRes, subtopicsRes] = await Promise.all([
      (() => {
        let q = supabase
          .from('answers')
          .select(`
            id, serial_number, content, confidence_score, status, created_at,
            question_id,
            questions ( id, serial_number, content_text, status, topic_id, subtopic_id )
          `)
          .in('status', ['approved', 'draft'])
          .or('confidence_score.lt.0.7,confidence_score.is.null')
          .order('confidence_score', { ascending: true, nullsFirst: true })
          .limit(200)

        if (questionIds !== null && questionIds.length > 0) {
          q = q.in('question_id', questionIds)
        }
        return q
      })(),
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
        questions: a.questions ? {
          ...a.questions,
          topics: topicMap[(a.questions as any).topic_id] ?? null,
          subtopics: subtopicMap[(a.questions as any).subtopic_id] ?? null,
        } : null,
      }))
    }
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error'
  }

  return <AnswerQueueClient key={subjectCode} initialAnswers={answers} initialError={error} />
}
