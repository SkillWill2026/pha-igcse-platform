import { unstable_noStore } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import { DatabankDocumentsClient } from '@/components/admin/DatabankDocumentsClient'

export const dynamic = 'force-dynamic'

export default async function DatabankDocumentsPage() {
  unstable_noStore()

  let documents: unknown[] = []
  let topics: unknown[] = []
  let error: string | null = null

  try {
    const supabase = createAdminClient()

    const [docsRes, topicsRes] = await Promise.all([
      supabase
        .from('databank_documents')
        .select(`
          id,
          title,
          doc_type,
          topic_id,
          file_name,
          file_size,
          page_count,
          chunk_count,
          processing_status,
          processing_error,
          created_at,
          topics ( name, ref )
        `)
        .order('created_at', { ascending: false }),
      supabase
        .from('topics')
        .select('id, name, ref')
        .order('ref'),
    ])

    if (docsRes.error) error = docsRes.error.message
    else documents = docsRes.data ?? []

    if (!topicsRes.error) topics = topicsRes.data ?? []

  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error'
  }

  return (
    <DatabankDocumentsClient
      initialDocuments={documents}
      initialTopics={topics}
      initialError={error}
    />
  )
}
