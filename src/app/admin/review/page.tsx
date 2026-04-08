import { unstable_noStore as noStore } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import type { QuestionWithRelations, AnswerRow } from '@/types/database'
import { ReviewQueueClient } from './review-queue-client'

export const dynamic = 'force-dynamic'

interface DraftQuestion extends QuestionWithRelations {
  answer: AnswerRow | null
}

export default async function ReviewPage() {
  noStore()
  let drafts: DraftQuestion[] = []
  let error: string | null = null

  try {
    const supabase = createAdminClient()

    // Fetch all draft questions ordered by subtopic
    const { data: questions, error: qErr } = await supabase
      .from('questions')
      .select('id, serial_number, content_text, difficulty, question_type, marks, status, exam_board_id, topic_id, subtopic_id, sub_subtopic_id, image_url, parent_question_ref, part_label, ai_extracted, source_question_id, created_at, updated_at, batch_id')
      .eq('status', 'draft')
      .order('subtopic_id')

    if (qErr) {
      console.error('[ReviewPage] questions fetch error:', qErr.message)
      error = `Failed to fetch questions: ${qErr.message}`
    } else if (questions && questions.length > 0) {
      // Fetch all reference data in parallel
      const questionIds = questions.map((q) => q.id)
      const [boardRes, topicRes, subtopicRes, sstRes, answerRes] = await Promise.all([
        supabase.from('exam_boards').select('id, name'),
        supabase.from('topics').select('id, ref, name'),
        supabase.from('subtopics').select('id, ref, title, topic_id'),
        supabase.from('sub_subtopics').select('id, subtopic_id, ext_num, outcome, tier'),
        supabase.from('answers').select('*').in('question_id', questionIds),
      ])

      const boardMap = new Map((boardRes.data ?? []).map((b) => [b.id, b]))
      const topicMap = new Map((topicRes.data ?? []).map((t) => [t.id, t]))
      const subtopicMap = new Map((subtopicRes.data ?? []).map((s) => [s.id, { id: s.id, ref: s.ref, name: s.title }]))
      const sstMap = new Map((sstRes.data ?? []).map((s) => [s.id, s]))
      const answerMap = new Map((answerRes.data ?? []).map((a) => [a.question_id, a]))

      drafts = questions.map((q) => ({
        ...q,
        exam_boards: boardMap.get(q.exam_board_id) ?? null,
        topics: topicMap.get(q.topic_id) ?? null,
        subtopics: subtopicMap.get(q.subtopic_id) ?? null,
        sub_subtopics: sstMap.get(q.sub_subtopic_id) ?? null,
        answer_serial: null,
        answer_status: null,
        answer: answerMap.get(q.id) ?? null,
      })) as DraftQuestion[]
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[ReviewPage] unexpected error:', err)
    error = `Unexpected error: ${msg}`
  }

  return <ReviewQueueClient drafts={drafts} initialError={error} />
}
