export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// ── Helpers ──────────────────────────────────────────────────────────────────
const isValidUUID = (v: unknown): v is string =>
  typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)

// Map legacy status values to allowed CHECK constraint values
const sanitiseStatus = (s: string): string => {
  if (s === 'done') return 'completed'
  if (s === 'error') return 'failed'
  return s
}

// ── GET — recent batches for the filter dropdown ──────────────────────────────
export async function GET() {
  try {
    const data = await prisma.upload_batches.findMany({
      orderBy: { created_at: 'desc' },
      take: 20,
    })
    return NextResponse.json(data)
  } catch (err) {
    console.error('[GET /api/upload-batch]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── POST — create a new batch record ─────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      topic_id?: string | null
      subtopic_id?: string | null
      sub_subtopic_id?: string | null
      total_files: number
    }

    const data = await prisma.upload_batches.create({
      data: {
        id:                        crypto.randomUUID(),
        topic_id:                  isValidUUID(body.topic_id) ? body.topic_id : null,
        subtopic_id:               isValidUUID(body.subtopic_id) ? body.subtopic_id : null,
        sub_subtopic_id:           isValidUUID(body.sub_subtopic_id) ? body.sub_subtopic_id : null,
        total_files:               body.total_files,
        status:                    'processing',
        completed_files:           0,
        failed_files:              0,
        total_questions_extracted: 0,
      },
    })

    return NextResponse.json(data)
  } catch (err) {
    console.error('[POST /api/upload-batch]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── PATCH — update batch progress + final status ──────────────────────────────
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json() as {
      batch_id: string
      completed_files: number
      failed_files: number
      total_questions_extracted: number
      status: string
    }

    const data = await prisma.upload_batches.update({
      where: { id: body.batch_id },
      data: {
        completed_files:           body.completed_files,
        failed_files:              body.failed_files,
        total_questions_extracted: body.total_questions_extracted,
        status:                    sanitiseStatus(body.status),
        completed_at:              new Date(),
      },
    })

    return NextResponse.json(data)
  } catch (err) {
    console.error('[PATCH /api/upload-batch]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
