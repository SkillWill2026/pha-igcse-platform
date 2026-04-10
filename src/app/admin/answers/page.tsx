import { unstable_noStore as noStore } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import type { AnswerWithQuestion } from '@/types/database'
import { AnswersPageClient } from './answers-page-client'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: { subject?: string }
}

export default async function AnswersPage({ searchParams }: PageProps) {
  noStore()
  const subjectCode = searchParams.subject ?? '0580'

  let answers: AnswerWithQuestion[] = []
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

    // Fetch questions filtered by subject, plus all answers
    const [aRes, qRes] = await Promise.all([
      supabase
        .from('answers')
        .select('id, content, step_by_step, mark_scheme, confidence_score, status, ai_generated, serial_number, created_at, updated_at, question_id')
        .order('created_at', { ascending: false }),
      topicIds.length > 0
        ? supabase
            .from('questions')
            .select('id, serial_number, content_text, difficulty, question_type, marks, status, ai_extracted, exam_board_id, topic_id, subtopic_id, sub_subtopic_id, image_url')
            .in('topic_id', topicIds)
        : supabase
            .from('questions')
            .select('id, serial_number, content_text, difficulty, question_type, marks, status, ai_extracted, exam_board_id, topic_id, subtopic_id, sub_subtopic_id, image_url'),
    ])

    if (aRes.error) {
      error = `Failed to fetch answers: ${aRes.error.message}`
    } else if (qRes.error) {
      error = `Failed to fetch questions: ${qRes.error.message}`
    } else {
      const questionMap = new Map((qRes.data ?? []).map((q) => [q.id, q]))
      // Only include answers whose question belongs to the active subject
      answers = (aRes.data ?? [])
        .filter(a => questionMap.has(a.question_id))
        .map(a => ({
          ...a,
          questions: questionMap.get(a.question_id) ?? null,
        })) as AnswerWithQuestion[]
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    error = `Unexpected error: ${msg}`
  }

  return <AnswersPageClient key={subjectCode} answers={answers} initialError={error} />
}
