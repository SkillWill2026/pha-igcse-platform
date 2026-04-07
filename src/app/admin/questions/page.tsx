import { unstable_noStore as noStore } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import type { QuestionWithRelations } from '@/types/database'
import { QuestionsLibrary } from './questions-library'

export const dynamic = 'force-dynamic'

export default async function QuestionsPage() {
  noStore()
  let questions: QuestionWithRelations[] = []
  let boards:    { id: string; name: string }[] = []

  try {
    const supabase = createAdminClient()

    // Flat-fetch pattern: no embedded joins for sub_subtopics (FK may not exist yet).
    // topics + subtopics embedded joins are safe since those FKs were in the original schema.
    const [qRes, bRes, sstRes] = await Promise.all([
      supabase
        .from('questions')
        .select(`
          id, content_text, difficulty, question_type, marks, status,
          ai_extracted, created_at, updated_at,
          exam_board_id, topic_id, subtopic_id, sub_subtopic_id, image_url, source_question_id,
          topics(ref, name),
          subtopics(ref, title)
        `)
        .order('created_at', { ascending: false }),
      supabase.from('exam_boards').select('id, name').order('name'),
      supabase.from('sub_subtopics').select('id, ext_num, outcome, tier'),
    ])

    if (qRes.error)   console.error('[QuestionsPage] questions error:',    qRes.error)
    if (bRes.error)   console.error('[QuestionsPage] boards error:',       bRes.error)
    if (sstRes.error) console.error('[QuestionsPage] sub_subtopics error:', sstRes.error)

    boards = bRes.data ?? []

    const boardMap = new Map(boards.map((b) => [b.id, b]))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sstMap   = new Map((sstRes.data ?? []).map((s: any) => [s.id, s]))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    questions = (qRes.data ?? []).map((q: any) => ({
      ...q,
      exam_boards:   boardMap.get(q.exam_board_id) ?? null,
      topics:        q.topics    ?? null,
      subtopics:     q.subtopics ? { id: q.subtopic_id, ref: q.subtopics.ref, name: q.subtopics.title ?? '' } : null,
      sub_subtopics: q.sub_subtopic_id ? (sstMap.get(q.sub_subtopic_id) ?? null) : null,
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
      />
    </div>
  )
}
