import { unstable_noStore } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'
import { DatabankDocumentsClient } from '@/components/admin/DatabankDocumentsClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DatabankDocumentsPage() {
  unstable_noStore()

  const serverClient = createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) redirect('/login')

  const supabase = createAdminClient()

  const [docsRes, topicsRes, profileRes] = await Promise.all([
    supabase
      .from('databank_documents')
      .select(`id, title, doc_type, topic_id, file_name, file_size, page_count, chunk_count, processing_status, processing_error, created_at, topics ( name, ref )`)
      .order('created_at', { ascending: false }),
    supabase.from('topics').select('id, name, ref').order('ref'),
    supabase.from('profiles').select('role').eq('id', user.id).single(),
  ])

  const role = (profileRes.data?.role as string) ?? 'tutor'

  return (
    <DatabankDocumentsClient
      initialDocuments={docsRes.data ?? []}
      initialTopics={topicsRes.data ?? []}
      initialError={docsRes.error?.message ?? null}
      role={role}
    />
  )
}
