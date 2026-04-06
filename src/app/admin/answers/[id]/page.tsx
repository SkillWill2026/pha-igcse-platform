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
    const { data, error } = await supabase
      .from('answers')
      .select(`
        id, content_text, step_by_step, mark_scheme, confidence_score,
        status, ai_generated, created_at, updated_at, question_id,
        questions(
          id, content_text, difficulty, question_type, marks, status,
          ai_extracted, created_at, updated_at,
          exam_board_id, topic_id, subtopic_id, image_url,
          exam_boards(id, name),
          topics(id, ref, name),
          subtopics(id, ref, name)
        )
      `)
      .eq('id', params.id)
      .single()

    if (error || !data) notFound()
    answer = data as unknown as AnswerWithQuestion
  } catch {
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
