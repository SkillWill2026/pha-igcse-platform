import { createAdminClient } from '@/lib/supabase'
import { UploadClient } from './upload-client'

export const dynamic = 'force-dynamic'

export default async function UploadPage() {
  let boards: { id: string; name: string }[] = []

  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('exam_boards').select('id, name').order('name')
    boards = data ?? []
  } catch {
    // Env vars not set yet — page renders with empty dropdowns
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Upload Exam Paper</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Upload a PDF or DOCX past-paper and the AI will extract all questions automatically.
      </p>
      <UploadClient boards={boards} />
    </div>
  )
}
