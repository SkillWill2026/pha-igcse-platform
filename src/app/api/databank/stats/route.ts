export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createAdminClient()

  const [docsRes, chunksRes, topicsRes, byTypeRes] = await Promise.all([
    supabase
      .from('databank_documents')
      .select('id, processing_status'),
    supabase
      .from('databank_chunks')
      .select('id', { count: 'exact', head: true }),
    supabase
      .from('topics')
      .select('id, name, ref')
      .order('ref'),
    supabase
      .from('databank_documents')
      .select('doc_type, processing_status')
      .eq('processing_status', 'completed'),
  ])

  if (docsRes.error) {
    return NextResponse.json({ error: docsRes.error.message }, { status: 500 })
  }

  const docs = docsRes.data ?? []
  const totalChunks = chunksRes.count ?? 0
  const topics = topicsRes.data ?? []
  const completedDocs = byTypeRes.data ?? []

  const byStatus = {
    completed: docs.filter(d => d.processing_status === 'completed').length,
    processing: docs.filter(d => d.processing_status === 'processing').length,
    pending: docs.filter(d => d.processing_status === 'pending').length,
    failed: docs.filter(d => d.processing_status === 'failed').length,
  }

  const byType: Record<string, number> = {}
  for (const d of completedDocs) {
    byType[d.doc_type] = (byType[d.doc_type] ?? 0) + 1
  }

  const { data: topicCoverage } = await supabase
    .from('databank_documents')
    .select('topic_id, chunk_count')
    .eq('processing_status', 'completed')

  const topicStats = topics.map(t => {
    const linked = (topicCoverage ?? []).filter(d => d.topic_id === t.id)
    return {
      id: t.id,
      ref: t.ref,
      name: t.name,
      doc_count: linked.length,
      chunk_count: linked.reduce((sum, d) => sum + (d.chunk_count ?? 0), 0),
    }
  })

  const coveredTopics = topicStats.filter(t => t.doc_count > 0).length

  return NextResponse.json({
    total_documents: docs.length,
    total_chunks: totalChunks,
    covered_topics: coveredTopics,
    total_topics: topics.length,
    by_status: byStatus,
    by_type: byType,
    topic_coverage: topicStats,
  })
}
