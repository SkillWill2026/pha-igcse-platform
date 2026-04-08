import { unstable_noStore as noStore } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import type { AnswerWithQuestion } from '@/types/database'
import { AnswersPageClient } from './answers-page-client'

export const dynamic = 'force-dynamic'

export default async function AnswersPage() {
  noStore()
  let answers: AnswerWithQuestion[] = []
  let error: string | null = null

  try {
    const supabase = createAdminClient()

    // Fetch all answers with linked questions
    const [aRes, qRes] = await Promise.all([
      supabase
        .from('answers')
        .select('id, content, step_by_step, mark_scheme, confidence_score, status, ai_generated, serial_number, created_at, updated_at, question_id')
        .order('created_at', { ascending: false }),
      supabase
        .from('questions')
        .select('id, serial_number, content_text, difficulty, question_type, marks, status, ai_extracted, exam_board_id, topic_id, subtopic_id, sub_subtopic_id, image_url'),
    ])

    if (aRes.error) {
      console.error('[AnswersPage] answers fetch error:', aRes.error.message)
      error = `Failed to fetch answers: ${aRes.error.message}`
    } else if (qRes.error) {
      console.error('[AnswersPage] questions fetch error:', qRes.error.message)
      error = `Failed to fetch questions: ${qRes.error.message}`
    } else {
      const questionMap = new Map((qRes.data ?? []).map((q) => [q.id, q]))
      answers = (aRes.data ?? []).map((a) => ({
        ...a,
        questions: questionMap.get(a.question_id) ?? null,
      })) as AnswerWithQuestion[]
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[AnswersPage] unexpected error:', err)
    error = `Unexpected error: ${msg}`
  }

  return <AnswersPageClient answers={answers} initialError={error} />
}
