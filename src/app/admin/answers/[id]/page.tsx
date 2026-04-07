import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase'
import type { AnswerWithQuestion } from '@/types/database'
import { AnswerReviewClient } from './review-client'

export const dynamic = 'force-dynamic'

export default async function AnswerReviewPage({
  params,
}: {
  params: { id: string }
}) {
  let answer: AnswerWithQuestion | null = null

  try {
    const supabase = createAdminClient()
    const [aRes, bRes, tRes, sRes] = await Promise.all([
      supabase
        .from('answers')
        .select(
          'id, content_text, step_by_step, mark_scheme, confidence_score,' +
          'status, ai_generated, created_at, updated_at, question_id',
        )
        .eq('id', params.id)
        .single(),
      supabase.from('exam_boards').select('id, name'),
      supabase.from('topics').select('id, ref, name'),
      supabase.from('subtopics').select('id, ref, name:title'),
    ])

    if (aRes.error || !aRes.data) {
      console.error('[AnswerReviewPage] answer fetch error:', aRes.error)
      notFound()
    }

    // Fetch the associated question separately (no joins)
    const qRes = await supabase
      .from('questions')
      .select(
        'id, content_text, difficulty, question_type, marks, status,' +
        'ai_extracted, created_at, updated_at,' +
        'exam_board_id, topic_id, subtopic_id, image_url',
      )
      .eq('id', aRes.data.question_id)
      .single()

    const boardMap    = new Map((bRes.data ?? []).map((b) => [b.id, b]))
    const topicMap    = new Map((tRes.data ?? []).map((t) => [t.id, t]))
    const subtopicMap = new Map((sRes.data ?? []).map((s) => [s.id, { id: s.id, ref: s.ref, name: s.name }]))

    const q = qRes.data
      ? {
          ...qRes.data,
          exam_boards: boardMap.get(qRes.data.exam_board_id) ?? null,
          topics:      topicMap.get(qRes.data.topic_id)      ?? null,
          subtopics:   subtopicMap.get(qRes.data.subtopic_id) ?? null,
        }
      : null

    answer = { ...aRes.data, questions: q } as unknown as AnswerWithQuestion

  } catch (err) {
    console.error('[AnswerReviewPage] unexpected error:', err)
    notFound()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const q = answer.questions as any

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/admin/answers"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Answers Library
      </Link>

      <div>
        <h1 className="text-xl font-bold">Review Answer</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {q?.subtopics?.ref} – {q?.subtopics?.name}
          {q?.exam_boards?.name ? ` · ${q.exam_boards.name}` : ''}
        </p>
      </div>

      <AnswerReviewClient answer={answer} />
    </div>
  )
}
