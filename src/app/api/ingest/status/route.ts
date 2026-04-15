import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/ingest/status?batch_id=<uuid>
// Lightweight poll endpoint — reads upload_batches row for live status
export async function GET(request: NextRequest) {
  const batch_id = request.nextUrl.searchParams.get('batch_id')

  if (!batch_id) {
    return NextResponse.json({ error: 'batch_id required' }, { status: 400 })
  }

  try {
    const data = await prisma.upload_batches.findUnique({
      where: { id: batch_id },
      select: {
  id:                         true,
  status:                     true,
  total_questions_extracted:  true,
  error_message:              true,
  source_file_name:           true,
},
    })

    if (!data) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('[GET /api/ingest/status]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
