import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-edge-secret')
  if (secret !== process.env.EDGE_FUNCTION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { questions, batch_id, status, total_questions_extracted, error_message, progress_update } = body

    // Handle progress-only updates
    if (progress_update && !status) {
      await prisma.upload_batches.updateMany({
        where: { id: batch_id },
        data: { total_questions_extracted: total_questions_extracted ?? 0, updated_at: new Date() }
      })
      return NextResponse.json({ success: true, inserted: 0 })
    }

    // Update batch status
    if (status) {
      await prisma.upload_batches.updateMany({
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

    // Insert questions
    let inserted = 0
    if (questions && questions.length > 0) {
      for (const q of questions) {
        try {
          await prisma.questions.create({
            data: {
              id: randomUUID(),
              exam_board_id: q.exam_board_id ?? null,
              topic_id: q.topic_id ?? null,
              subtopic_id: q.subtopic_id ?? null,
              sub_subtopic_id: q.sub_subtopic_id ?? null,
              batch_position: q.batch_position ?? 0,
              content_text: String(q.content_text ?? '').trim(),
              parent_question_ref: q.parent_question_ref ?? null,
              part_label: q.part_label ?? null,
              batch_id: q.batch_id ?? batch_id,
              difficulty: q.difficulty ?? 2,
              question_type: q.question_type ?? 'structured',
              marks: q.marks ?? 1,
              status: 'draft',
              ai_extracted: true,
              created_at: new Date(),
              updated_at: new Date(),
            }
          })
          inserted++
        } catch (qErr) {
          console.error('Question insert failed:', qErr)
        }
      }
    }

    return NextResponse.json({ success: true, inserted })

  } catch (err) {
    console.error('/api/ingest/questions error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
