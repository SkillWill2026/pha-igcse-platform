import { unstable_noStore } from 'next/cache'
import { createServerClient } from '@/lib/supabase-server'
import { DatabankDocumentsClient } from '@/components/admin/DatabankDocumentsClient'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function DatabankDocumentsPage() {
  unstable_noStore()

  const serverClient = createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) redirect('/login')

  const supabase = createAdminClient()

  const [docsRaw, topicsRes, profileRes] = await Promise.all([
    prisma.databank_documents.findMany({
      select: {
        id:                true,
        title:             true,
        doc_type:          true,
        topic_id:          true,
        file_name:         true,
        file_size:         true,
        page_count:        true,
        chunk_count:       true,
        processing_status: true,
        processing_error:  true,
        created_at:        true,
      },
      orderBy: { created_at: 'desc' },
    }),
    supabase.from('topics').select('id, name, ref').order('ref'),
    supabase.from('profiles').select('role').eq('id', user.id).single(),
  ])

  // Enrich with topic data from Supabase
  const topicMap = Object.fromEntries(
    (topicsRes.data ?? []).map(t => [t.id, { name: t.name, ref: t.ref }])
  )

  const docs = docsRaw.map(d => ({
    ...d,
    topics: d.topic_id ? (topicMap[d.topic_id] ?? null) : null,
  }))

  const role = (profileRes.data?.role as string) ?? 'tutor'

  return (
    <DatabankDocumentsClient
      initialDocuments={docs}
      initialTopics={topicsRes.data ?? []}
      initialError={null}
      role={role}
    />
  )
}
