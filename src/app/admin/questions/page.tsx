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
    const [qRes, bRes, tRes, sRes] = await Promise.all([
      supabase
        .from('questions')
        .select(`
          id, content_text, difficulty, question_type, marks, status,
          ai_extracted, created_at, updated_at,
          exam_board_id, topic_id, subtopic_id, image_url, source_question_id,
          exam_boards(id, name),
          topics(id, ref, name),
          subtopics(id, ref, name)
        `)
        .order('created_at', { ascending: false }),
      supabase.from('exam_boards').select('id, name').order('name'),
      supabase.from('topics').select('id, ref, name').order('ref'),
      supabase.from('subtopics').select('id, ref, name, topic_id').order('ref'),
    ])
    questions = (qRes.data as unknown as QuestionWithRelations[]) ?? []
    boards = bRes.data ?? []
    topics = tRes.data ?? []
    subtopics = sRes.data ?? []
  } catch {
    // DB not yet configured
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
