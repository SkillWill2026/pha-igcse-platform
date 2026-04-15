export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const serverClient = createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const profile = await prisma.profiles.findUnique({ where: { id: user.id }, select: { role: true } })
  if (profile?.role !== 'admin') return { error: NextResponse.json({ error: 'Admin access required' }, { status: 403 }) }
  return { error: null }
}

export async function GET(request: NextRequest) {
  const check = await requireAdmin()
  if (check.error) return check.error

  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from') ?? new Date(Date.now() - 86400000).toISOString()
  const to   = searchParams.get('to')   ?? new Date().toISOString()

  const [batches, approvedQs, rejectedQs, answers, pptDecks, databankDocs] = await Promise.all([
    prisma.upload_batches.findMany({
      where: { created_at: { gte: new Date(from), lte: new Date(to) } },
      select: {
        id:                        true,
        created_by:                true,
        total_files:               true,
        completed_files:           true,
        failed_files:              true,
        total_questions_extracted: true,
        status:                    true,
        created_at:                true,
      },
      orderBy: { created_at: 'desc' },
    }),
    prisma.questions.findMany({
      where: { status: 'approved', updated_at: { gte: new Date(from), lte: new Date(to) } },
      select: { id: true, updated_at: true },
    }),
    prisma.questions.findMany({
      where: { status: 'rejected', updated_at: { gte: new Date(from), lte: new Date(to) } },
      select: { id: true, updated_at: true },
    }),
    prisma.answers.findMany({
      where: { created_at: { gte: new Date(from), lte: new Date(to) } },
      select: { id: true, created_at: true },
    }),
    prisma.ppt_decks.findMany({
      where: { created_at: { gte: new Date(from), lte: new Date(to) } },
      select: { id: true, title: true, created_at: true },
    }),
    // NEW — Databank documents
    prisma.databank_documents.findMany({
      where: { created_at: { gte: new Date(from), lte: new Date(to) } },
      select: {
        id:         true,
        title:      true,
        uploaded_by: true,
        doc_type:   true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    }),
  ])

  // Collect all unique user IDs (batches + databank)
  const batchCreatorIds  = batches.map(b => b.created_by).filter((id): id is string => id !== null)
  const databankUploaderIds = databankDocs.map(d => d.uploaded_by).filter((id): id is string => id !== null)
  const creatorIds = [...new Set([...batchCreatorIds, ...databankUploaderIds])]

  const profiles = creatorIds.length > 0
    ? await prisma.profiles.findMany({
        where: { id: { in: creatorIds } },
        select: { id: true, full_name: true, role: true },
      })
    : []
  const profileMap = Object.fromEntries(profiles.map(p => [p.id, p]))

  // Aggregate per user — batches
  const byUser: Record<string, {
    userId: string; fullName: string; role: string
    batchCount: number; filesUploaded: number; questionsExtracted: number
    failedFiles: number; databankUploads: number
  }> = {}

  for (const b of batches) {
    const uid  = b.created_by ?? 'system'
    const prof = b.created_by ? (profileMap[b.created_by] ?? null) : null
    if (!byUser[uid]) {
      byUser[uid] = {
        userId: uid, fullName: prof?.full_name ?? 'Unknown',
        role: prof?.role ?? '', batchCount: 0, filesUploaded: 0,
        questionsExtracted: 0, failedFiles: 0, databankUploads: 0,
      }
    }
    byUser[uid].batchCount++
    byUser[uid].filesUploaded      += b.total_files               ?? 0
    byUser[uid].questionsExtracted += b.total_questions_extracted ?? 0
    byUser[uid].failedFiles        += b.failed_files              ?? 0
  }

  // Aggregate per user — databank uploads
  for (const d of databankDocs) {
    const uid  = d.uploaded_by ?? 'system'
    const prof = d.uploaded_by ? (profileMap[d.uploaded_by] ?? null) : null
    if (!byUser[uid]) {
      byUser[uid] = {
        userId: uid, fullName: prof?.full_name ?? 'Unknown',
        role: prof?.role ?? '', batchCount: 0, filesUploaded: 0,
        questionsExtracted: 0, failedFiles: 0, databankUploads: 0,
      }
    }
    byUser[uid].databankUploads++
  }

  return NextResponse.json({
    period: { from, to },
    summary: {
      totalBatches:            batches.length,
      totalFilesUploaded:      batches.reduce((s, b) => s + (b.total_files               ?? 0), 0),
      totalQuestionsExtracted: batches.reduce((s, b) => s + (b.total_questions_extracted ?? 0), 0),
      totalApproved:           approvedQs.length,
      totalRejected:           rejectedQs.length,
      totalAnswersGenerated:   answers.length,
      totalPPTDecks:           pptDecks.length,
      totalDatabankUploads:    databankDocs.length,  // NEW
    },
    byUser: Object.values(byUser),
    recentBatches: batches.slice(0, 30).map(b => ({
      id:                 b.id,
      uploadedBy:         b.created_by ? (profileMap[b.created_by]?.full_name ?? 'Unknown') : 'Unknown',
      totalFiles:         b.total_files,
      completedFiles:     b.completed_files,
      failedFiles:        b.failed_files,
      questionsExtracted: b.total_questions_extracted,
      status:             b.status,
      createdAt:          b.created_at,
    })),
    recentPPT: pptDecks.map(p => ({ id: p.id, title: p.title, createdAt: p.created_at })),
    // NEW
    recentDatabank: databankDocs.slice(0, 30).map(d => ({
      id:         d.id,
      title:      d.title,
      uploadedBy: d.uploaded_by ? (profileMap[d.uploaded_by]?.full_name ?? 'Unknown') : 'Unknown',
      docType:    d.doc_type,
      createdAt:  d.created_at,
    })),
  })
}
