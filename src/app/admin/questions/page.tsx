import { createAdminClient } from '@/lib/supabase'
import { QuestionsLibrary } from './questions-library'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ subject?: string }>
}

export default async function QuestionsPage({ searchParams }: PageProps) {
  const { subject: subjectCode = '0580' } = await searchParams
  const supabase = createAdminClient()

  // Resolve subject code → UUID and fetch matching exam boards in parallel
  const [subjectRes, boardsRes] = await Promise.all([
    supabase.from('subjects').select('id, code, name').eq('code', subjectCode).single(),
    supabase.from('exam_boards').select('id, name').order('name'),
  ])

  const subjectId = subjectRes.data?.id ?? null
  const boards = boardsRes.data ?? []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Questions Library</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Browse, filter, and review all extracted questions.
      </p>
      <QuestionsLibrary boards={boards} subjectId={subjectId} />
    </div>
  )
}
