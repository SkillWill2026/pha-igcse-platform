export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const docs = await prisma.databank_documents.findMany({
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
    })

    // Enrich with topic data (replaces Supabase nested join)
    const topicIds = [...new Set(docs.map(d => d.topic_id).filter((id): id is string => id !== null))]
    const topicsRaw = topicIds.length > 0
      ? await prisma.topics.findMany({
          where: { id: { in: topicIds } },
          select: { id: true, name: true, ref: true },
        })
      : []
    const topicMap = Object.fromEntries(topicsRaw.map(t => [t.id, { name: t.name, ref: t.ref }]))

    const documents = docs.map(d => ({
      ...d,
      topics: d.topic_id ? (topicMap[d.topic_id] ?? null) : null,
    }))

    return NextResponse.json({ documents })
  } catch (err) {
    console.error('[GET /api/databank/documents]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      title?: string
      doc_type?: string
      topic_id?: string | null
      file_path?: string
      file_name?: string
      file_size?: number | null
    }
    const { title, doc_type, topic_id, file_path, file_name, file_size } = body

    if (!title || !doc_type || !file_path || !file_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const doc = await prisma.databank_documents.create({
      data: {
        id:                crypto.randomUUID(),
        title,
        doc_type,
        topic_id:          topic_id || null,
        file_path,
        file_name,
        file_size:         file_size || null,
        processing_status: 'pending',
        created_at:        new Date(),
      },
    })

    return NextResponse.json({ document: doc })
  } catch (err) {
    console.error('[POST /api/databank/documents]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
