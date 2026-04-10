import { createAdminClient } from '@/lib/supabase'
import { UploadClient } from './upload-client'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: { subject?: string }
}

export default async function UploadPage({ searchParams }: PageProps) {
  const subjectCode = searchParams.subject ?? '0580'

  let boards: { id: string; name: string }[] = []
  let subjectId: string | null = null
  let subjectName = 'Mathematics'

  try {
    const supabase = createAdminClient()
    const [boardsRes, subjectRes] = await Promise.all([
      supabase.from('exam_boards').select('id, name').order('name'),
      supabase.from('subjects').select('id, name').eq('code', subjectCode).single(),
    ])
    boards = boardsRes.data ?? []
    subjectId = subjectRes.data?.id ?? null
    subjectName = subjectRes.data?.name ?? 'Mathematics'
  } catch {
    // Env vars not set yet
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Upload Exam Paper</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Upload a PDF or DOCX past-paper for <strong>{subjectName}</strong> and the AI will extract all questions automatically.
      </p>
      <UploadClient boards={boards} subjectId={subjectId} subjectName={subjectName} />
    </div>
  )
}
