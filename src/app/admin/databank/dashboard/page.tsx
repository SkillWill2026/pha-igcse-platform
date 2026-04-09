import { unstable_noStore } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import { DatabankDashboardClient } from '@/components/admin/DatabankDashboardClient'

export const dynamic = 'force-dynamic'

export default async function DatabankDashboardPage() {
  unstable_noStore()

  let stats: unknown = null
  let recentDocs: unknown[] = []
  let error: string | null = null

  try {
    const supabase = createAdminClient()

    const [docsRes, chunksRes, topicsRes, completedRes, recentRes] = await Promise.all([
      supabase.from('databank_documents').select('id, processing_status'),
      supabase.from('databank_chunks').select('id', { count: 'exact', head: true }),
      supabase.from('topics').select('id, name, ref').order('ref'),
      supabase.from('databank_documents').select('doc_type, topic_id, chunk_count').eq('processing_status', 'completed'),
      supabase
        .from('databank_documents')
        .select('id, title, doc_type, processing_status, chunk_count, page_count, created_at, topics(name, ref)')
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    const docs = docsRes.data ?? []
    const topics = topicsRes.data ?? []
    const completed = completedRes.data ?? []

    const byStatus = {
      completed: docs.filter(d => d.processing_status === 'completed').length,
      processing: docs.filter(d => d.processing_status === 'processing').length,
      pending: docs.filter(d => d.processing_status === 'pending').length,
      failed: docs.filter(d => d.processing_status === 'failed').length,
    }

    const byType: Record<string, number> = {}
    for (const d of completed) {
      byType[d.doc_type] = (byType[d.doc_type] ?? 0) + 1
    }

    const topicCoverage = topics.map(t => {
      const linked = completed.filter(d => d.topic_id === t.id)
      return {
        id: t.id,
        ref: t.ref,
        name: t.name,
        doc_count: linked.length,
        chunk_count: linked.reduce((sum, d) => sum + (d.chunk_count ?? 0), 0),
      }
    })

    stats = {
      total_documents: docs.length,
      total_chunks: chunksRes.count ?? 0,
      covered_topics: topicCoverage.filter(t => t.doc_count > 0).length,
      total_topics: topics.length,
      by_status: byStatus,
      by_type: byType,
      topic_coverage: topicCoverage,
    }

    if (!recentRes.error) recentDocs = recentRes.data ?? []

  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error'
  }

  return (
    <DatabankDashboardClient
      initialStats={stats}
      initialRecentDocs={recentDocs}
      initialError={error}
    />
  )
}
