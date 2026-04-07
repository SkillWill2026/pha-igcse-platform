import { unstable_noStore as noStore } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import type { AnswerWithQuestion } from '@/types/database'
import { AnswersLibrary } from './answers-library'

export const dynamic = 'force-dynamic'

export default async function AnswersPage() {
  noStore()
  let answers: AnswerWithQuestion[] = []
  let boards:    { id: string; name: string }[]                    = []
  let topics:    { id: string; ref: string; name: string }[]       = []
  let subtopics: { id: string; ref: string; name: string; topic_id: string }[] = []

  try {
    const supabase = createAdminClient()
    const [aRes, bRes, tRes, sRes] = await Promise.all([
      supabase
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
        .order('created_at', { ascending: false }),
      supabase.from('exam_boards').select('id, name').order('name'),
      supabase.from('topics').select('id, ref, name').order('ref'),
      supabase.from('subtopics').select('id, ref, name, topic_id').order('ref'),
    ])
    if (aRes.error)  console.error('[AnswersPage] answers query error:',   aRes.error)
    if (bRes.error)  console.error('[AnswersPage] boards query error:',    bRes.error)
    if (tRes.error)  console.error('[AnswersPage] topics query error:',    tRes.error)
    if (sRes.error)  console.error('[AnswersPage] subtopics query error:', sRes.error)
    answers   = (aRes.data as unknown as AnswerWithQuestion[]) ?? []
    boards    = bRes.data ?? []
    topics    = tRes.data ?? []
    subtopics = sRes.data ?? []
  } catch (err) {
    console.error('[AnswersPage] unexpected error:', err)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Answers Library</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Review AI-generated worked solutions before publishing.
      </p>
      <AnswersLibrary
        answers={answers}
        boards={boards}
        topics={topics}
        subtopics={subtopics}
      />
    </div>
  )
}
