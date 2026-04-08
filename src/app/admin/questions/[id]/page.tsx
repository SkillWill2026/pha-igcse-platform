import { notFound } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase'
import type { QuestionWithRelations, AnswerRow } from '@/types/database'
import { ReviewClient } from './review-client'

export const dynamic = 'force-dynamic'

export default async function QuestionReviewPage({
  params,
}: {
  params: { id: string }
}) {
  noStore()
  let question: QuestionWithRelations | null = null
  let answer: AnswerRow | null = null
  let allBoards: { id: string; name: string }[] = []
  let allSubtopics: { id: string; ref: string; title: string; topic_id: string }[] = []
  let allTopics: { id: string; ref: string; name: string }[] = []
  let allSubSubtopics: { id: string; ref: string; title: string; subtopic_id: string }[] = []

  try {
    const supabase = createAdminClient()
    const [qRes, bRes, tRes, sRes, sstRes] = await Promise.all([
      supabase
        .from('questions')
        .select(
          'id, serial_number, parent_question_ref, part_label, content_text, difficulty, question_type, marks, status,' +
          'ai_extracted, created_at, updated_at,' +
          'exam_board_id, topic_id, subtopic_id, sub_subtopic_id, image_url, source_question_id, batch_id',
        )
        .eq('id', params.id)
        .single(),
      supabase.from('exam_boards').select('id, name').order('name'),
      supabase.from('topics').select('id, ref, name').order('sort_order'),
      supabase.from('subtopics').select('id, ref, title, topic_id').order('sort_order'),
      supabase.from('sub_subtopics').select('id, subtopic_id, ext_num, outcome, sort_order').order('sort_order'),
    ])

    if (qRes.error || !qRes.data) {
      console.error('[QuestionReviewPage] question fetch error:', qRes.error)
      notFound()
    }

    allBoards    = bRes.data ?? []
    allTopics    = (tRes.data ?? []) as typeof allTopics
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allSubtopics = (sRes.data ?? []) as any

    const boardMap       = new Map(allBoards.map((b) => [b.id, b]))
    const topicMap       = new Map(allTopics.map((t) => [t.id, t]))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subtopicMap    = new Map(allSubtopics.map((s: any) => [s.id, { id: s.id, ref: s.ref, name: s.title ?? '' }]))
    const subtopicRefMap = new Map(allSubtopics.map((s: { id: string; ref: string }) => [s.id, s.ref]))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allSubSubtopics = (sstRes.data ?? []).map((s: any) => ({
      id: s.id,
      subtopic_id: s.subtopic_id,
      ref: `${subtopicRefMap.get(s.subtopic_id) ?? ''}.${s.ext_num}`,
      title: s.outcome ?? '',
      sort_order: s.sort_order,
    }))

    question = {
      ...qRes.data,
      exam_boards:   boardMap.get(qRes.data.exam_board_id)    ?? null,
      topics:        topicMap.get(qRes.data.topic_id)          ?? null,
      subtopics:     subtopicMap.get(qRes.data.subtopic_id)    ?? null,
      answer_serial: null,
      answer_status: null,
    } as unknown as QuestionWithRelations

    // Fetch linked answer
    const { data: answerData } = await supabase
      .from('answers')
      .select('id, question_id, content_text, step_by_step, mark_scheme, confidence_score, status, ai_generated, serial_number, created_at, updated_at')
      .eq('question_id', params.id)
      .maybeSingle()

    if (answerData) {
      answer = answerData as AnswerRow
    }

  } catch (err) {
    console.error('[QuestionReviewPage] unexpected error:', err)
    notFound()
  }

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/questions"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Questions Library
        </Link>
      </div>

      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Review Question</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {question!.subtopics?.ref} – {question!.subtopics?.name}
              {' · '}
              {question!.exam_boards?.name}
            </p>
          </div>
        </div>
      </div>

      <ReviewClient
        question={question!}
        answer={answer}
        allBoards={allBoards}
        allSubtopics={allSubtopics}
        allTopics={allTopics}
        allSubSubtopics={allSubSubtopics}
      />
    </div>
  )
}
