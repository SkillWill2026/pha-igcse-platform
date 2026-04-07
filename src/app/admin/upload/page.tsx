import { createAdminClient } from '@/lib/supabase'
import { UploadClient } from './upload-client'

export const dynamic = 'force-dynamic'

export default async function UploadPage() {
  let boards: { id: string; name: string }[] = []
  let subtopics: {
    id: string
    ref: string
    name: string
    topic_id: string
    topics: { ref: string; name: string } | null
  }[] = []

  try {
    const supabase = createAdminClient()
    const [boardsRes, subtopicsRes, topicsRes] = await Promise.all([
      supabase.from('exam_boards').select('id, name').order('name'),
      supabase.from('subtopics').select('id, ref, name, topic_id').order('ref'),
      supabase.from('topics').select('id, ref, name'),
    ])
    boards = boardsRes.data ?? []

    // Stitch topics onto subtopics manually (no PostgREST join needed)
    const topicMap = new Map((topicsRes.data ?? []).map((t) => [t.id, { ref: t.ref, name: t.name }]))
    subtopics = (subtopicsRes.data ?? []).map((s) => ({
      ...s,
      topics: topicMap.get(s.topic_id) ?? null,
    }))
  } catch {
    // Env vars not set yet — page renders with empty dropdowns
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Upload Exam Paper</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Upload a PDF or DOCX past-paper and the AI will extract all questions automatically.
      </p>
      <UploadClient boards={boards} subtopics={subtopics} />
    </div>
  )
}
