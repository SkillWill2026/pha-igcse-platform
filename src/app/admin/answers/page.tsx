import { unstable_noStore as noStore } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import type { AnswerWithQuestion } from '@/types/database'
import { AnswersLibrary } from './answers-library'

export const dynamic = 'force-dynamic'

export default async function AnswersPage() {
  noStore()
  let answers: AnswerWithQuestion[] = []
  let boards:    { id: string; name: string }[]                              = []
  let topics:    { id: string; ref: string; name: string }[]                 = []
  let subtopics: { id: string; ref: string; name: string; topic_id: string }[] = []

  try {
    const supabase = createAdminClient()

    // Fetch everything in parallel — no embedded joins so missing FK constraints
    // cannot silently zero out results.
    const [aRes, qRes, bRes, tRes, sRes] = await Promise.all([
      supabase
        .from('answers')
        .select(
          'id, content_text, step_by_step, mark_scheme, confidence_score,' +
          'status, ai_generated, created_at, updated_at, question_id',
        )
        .order('created_at', { ascending: false }),
      supabase
        .from('questions')
        .select(
          'id, content_text, difficulty, question_type, marks, status,' +
          'ai_extracted, created_at, updated_at,' +
          'exam_board_id, topic_id, subtopic_id, image_url',
        ),
      supabase.from('exam_boards').select('id, name').order('name'),
      supabase.from('topics').select('id, ref, name').order('ref'),
      supabase.from('subtopics').select('id, ref, name, topic_id').order('ref'),
    ])

    if (aRes.error) console.error('[AnswersPage] answers error:',   aRes.error)
    if (qRes.error) console.error('[AnswersPage] questions error:', qRes.error)
    if (bRes.error) console.error('[AnswersPage] boards error:',    bRes.error)
    if (tRes.error) console.error('[AnswersPage] topics error:',    tRes.error)
    if (sRes.error) console.error('[AnswersPage] subtopics error:', sRes.error)

    boards    = bRes.data ?? []
    topics    = tRes.data ?? []
    subtopics = sRes.data ?? []

    // Build lookup maps
    const boardMap    = new Map(boards.map((b) => [b.id, b]))
    const topicMap    = new Map(topics.map((t) => [t.id, t]))
    const subtopicMap = new Map(subtopics.map((s) => [s.id, { id: s.id, ref: s.ref, name: s.name }]))
    const questionMap = new Map((qRes.data ?? []).map((q) => [q.id, q]))

    answers = (aRes.data ?? []).map((a) => {
      const q = questionMap.get(a.question_id) ?? null
      return {
        ...a,
        questions: q
          ? {
              ...q,
              exam_boards: boardMap.get(q.exam_board_id) ?? null,
              topics:      topicMap.get(q.topic_id)      ?? null,
              subtopics:   subtopicMap.get(q.subtopic_id) ?? null,
            }
          : null,
      }
    }) as unknown as AnswerWithQuestion[]

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
