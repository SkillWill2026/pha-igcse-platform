// Receives extracted questions from Supabase Edge Function
// Secured with EDGE_FUNCTION_SECRET header
// Writes to Azure PostgreSQL via Prisma

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Verify secret
  const secret = req.headers.get('x-edge-secret')
  if (secret !== process.env.EDGE_FUNCTION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { questions, batch_id, status, total_questions_extracted, error_message } = body

  // Update batch status in Azure
  if (status) {
    await prisma.upload_batches.update({
      where: { id: batch_id },
      data: {
        status,
        total_questions_extracted: total_questions_extracted ?? 0,
        error_message: error_message ?? null,
        completed_files: status === 'completed' ? 1 : 0,
        failed_files: status === 'failed' ? 1 : 0,
        updated_at: new Date(),
      }
    })
  }

  // Insert questions into Azure
  if (questions && questions.length > 0) {
    await prisma.$transaction(
      questions.map((q: any) => prisma.questions.create({ data: q }))
    )
  }

  return NextResponse.json({ success: true, inserted: questions?.length ?? 0 })
}
