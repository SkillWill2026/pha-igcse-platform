import { unstable_noStore as noStore } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import type { QuestionWithRelations } from '@/types/database'
import { QuestionsLibrary } from './questions-library'

export const dynamic = 'force-dynamic'

export default async function QuestionsPage() {
  noStore()
  let questions: QuestionWithRelations[] = []
  let boards: { id: string; name: string }[] = []
  let topics: { id: string; ref: string; name: string }[] = []
  let subtopics: { id: string; ref: string; name: string; topic_id: string }[] = []

  try {
    const supabase = createAdminClient()

    // Fetch all four tables in parallel — questions with NO embedded joins so that
    // missing FK constraints cannot silently zero out the entire result.
    const [qRes, bRes, tRes, sRes] = await Promise.all([
      supabase
        .from('questions')
        .select(
          'id, content_text, difficulty, question_type, marks, status,' +
          'ai_extracted, created_at, updated_at,' +
          'exam_board_id, topic_id, subtopic_id, image_url, source_question_id',
        )
        .order('created_at', { ascending: false }),
      supabase.from('exam_boards').select('id, name').order('name'),
      supabase.from('topics').select('id, ref, name').order('ref'),
      supabase.from('subtopics').select('id, ref, name, topic_id').order('ref'),
    ])

    if (qRes.error) console.error('[QuestionsPage] questions error:', qRes.error)
    if (bRes.error) console.error('[QuestionsPage] boards error:',    bRes.error)
    if (tRes.error) console.error('[QuestionsPage] topics error:',    tRes.error)
    if (sRes.error) console.error('[QuestionsPage] subtopics error:', sRes.error)

    boards    = bRes.data ?? []
    topics    = tRes.data ?? []
    subtopics = sRes.data ?? []

    // Build lookup maps so we can stitch relations without relying on FK constraints
    const boardMap    = new Map(boards.map((b) => [b.id, b]))
    const topicMap    = new Map(topics.map((t) => [t.id, t]))
    const subtopicMap = new Map(subtopics.map((s) => [s.id, { id: s.id, ref: s.ref, name: s.name }]))

    questions = (qRes.data ?? []).map((q) => ({
      ...q,
      exam_boards: boardMap.get(q.exam_board_id)    ?? null,
      topics:      topicMap.get(q.topic_id)          ?? null,
      subtopics:   subtopicMap.get(q.subtopic_id)    ?? null,
    })) as unknown as QuestionWithRelations[]

  } catch (err) {
    console.error('[QuestionsPage] unexpected error:', err)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Questions Library</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Browse, filter, and review all extracted questions.
      </p>
      <QuestionsLibrary
        questions={questions}
        boards={boards}
        topics={topics}
        subtopics={subtopics}
      />
    </div>
  )
}
