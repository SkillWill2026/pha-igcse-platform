import { notFound } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase'
import type { QuestionWithRelations } from '@/types/database'
import { ReviewClient } from './review-client'

export const dynamic = 'force-dynamic'

export default async function QuestionReviewPage({
  params,
}: {
  params: { id: string }
}) {
  noStore()
  let question: QuestionWithRelations | null = null
  let allBoards: { id: string; name: string }[] = []

  try {
    const supabase = createAdminClient()
    const [qRes, bRes, tRes, sRes] = await Promise.all([
      supabase
        .from('questions')
        .select(
          'id, content_text, difficulty, question_type, marks, status,' +
          'ai_extracted, created_at, updated_at,' +
          'exam_board_id, topic_id, subtopic_id, image_url, source_question_id',
        )
        .eq('id', params.id)
        .single(),
      supabase.from('exam_boards').select('id, name').order('name'),
      supabase.from('topics').select('id, ref, name'),
      supabase.from('subtopics').select('id, ref, name:title'),
    ])

    if (qRes.error || !qRes.data) {
      console.error('[QuestionReviewPage] question fetch error:', qRes.error)
      notFound()
    }

    allBoards = bRes.data ?? []

    const boardMap    = new Map((bRes.data ?? []).map((b) => [b.id, b]))
    const topicMap    = new Map((tRes.data ?? []).map((t) => [t.id, t]))
    const subtopicMap = new Map((sRes.data ?? []).map((s) => [s.id, { id: s.id, ref: s.ref, name: s.name }]))

    question = {
      ...qRes.data,
      exam_boards: boardMap.get(qRes.data.exam_board_id)    ?? null,
      topics:      topicMap.get(qRes.data.topic_id)          ?? null,
      subtopics:   subtopicMap.get(qRes.data.subtopic_id)    ?? null,
    } as unknown as QuestionWithRelations

  } catch (err) {
    console.error('[QuestionReviewPage] unexpected error:', err)
    notFound()
  }

  return (
    <div className="max-w-3xl space-y-6">
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
              {question.subtopics?.ref} – {question.subtopics?.name}
              {' · '}
              {question.exam_boards?.name}
            </p>
          </div>
        </div>
      </div>

      <ReviewClient question={question} allBoards={allBoards} />
    </div>
  )
}
