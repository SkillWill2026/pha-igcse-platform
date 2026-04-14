export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const [docs, totalChunks, topics, completedDocs, topicCoverage] = await Promise.all([
      prisma.databank_documents.findMany({
        select: { id: true, processing_status: true },
      }),
      prisma.databank_chunks.count(),
      prisma.topics.findMany({
        select: { id: true, name: true, ref: true },
        orderBy: { ref: 'asc' },
      }),
      prisma.databank_documents.findMany({
        where: { processing_status: 'completed' },
        select: { doc_type: true, processing_status: true },
      }),
      prisma.databank_documents.findMany({
        where: { processing_status: 'completed' },
        select: { topic_id: true, chunk_count: true },
      }),
    ])

    const byStatus = {
      completed: docs.filter(d => d.processing_status === 'completed').length,
      processing: docs.filter(d => d.processing_status === 'processing').length,
      pending:    docs.filter(d => d.processing_status === 'pending').length,
      failed:     docs.filter(d => d.processing_status === 'failed').length,
    }

    const byType: Record<string, number> = {}
    for (const d of completedDocs) {
      byType[d.doc_type] = (byType[d.doc_type] ?? 0) + 1
    }

    const topicStats = topics.map(t => {
      const linked = topicCoverage.filter(d => d.topic_id === t.id)
      return {
        id:          t.id,
        ref:         t.ref,
        name:        t.name,
        doc_count:   linked.length,
        chunk_count: linked.reduce((sum, d) => sum + (d.chunk_count ?? 0), 0),
      }
    })

    const coveredTopics = topicStats.filter(t => t.doc_count > 0).length

    return NextResponse.json({
      total_documents: docs.length,
      total_chunks:    totalChunks,
      covered_topics:  coveredTopics,
      total_topics:    topics.length,
      by_status:       byStatus,
      by_type:         byType,
      topic_coverage:  topicStats,
    })
  } catch (err) {
    console.error('[GET /api/databank/stats]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
