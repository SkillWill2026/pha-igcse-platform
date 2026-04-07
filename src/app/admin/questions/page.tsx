import { createAdminClient } from '@/lib/supabase'
import { QuestionsLibrary } from './questions-library'

export const dynamic = 'force-dynamic'

export default async function QuestionsPage() {
  let boards: { id: string; name: string }[] = []

  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('exam_boards').select('id, name').order('name')
    boards = data ?? []
  } catch {
    // Env vars not set — renders with empty board dropdown
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Questions Library</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Browse, filter, and review all extracted questions.
      </p>
      <QuestionsLibrary boards={boards} />
    </div>
  )
}
