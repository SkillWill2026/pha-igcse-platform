export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'

async function requireAdmin() {
  const serverClient = createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const adminClient = createAdminClient()
  const { data: profile } = await adminClient.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: NextResponse.json({ error: 'Admin access required' }, { status: 403 }) }
  return { error: null }
}

export async function GET(request: NextRequest) {
  const check = await requireAdmin()
  if (check.error) return check.error

  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from') ?? new Date(Date.now() - 86400000).toISOString()
  const to   = searchParams.get('to')   ?? new Date().toISOString()

  const supabase = createAdminClient()

  const [batchesRes, approvedRes, rejectedRes, answersRes, pptRes] = await Promise.all([
    supabase
      .from('upload_batches')
      .select('id, created_by, total_files, completed_files, failed_files, total_questions_extracted, status, created_at, profiles(full_name, role)')
      .gte('created_at', from).lte('created_at', to)
      .order('created_at', { ascending: false }),
    supabase.from('questions').select('id, updated_at').eq('status', 'approved').gte('updated_at', from).lte('updated_at', to),
    supabase.from('questions').select('id, updated_at').eq('status', 'rejected').gte('updated_at', from).lte('updated_at', to),
    supabase.from('answers').select('id, created_at').gte('created_at', from).lte('created_at', to),
    supabase.from('ppt_decks').select('id, title, created_at').gte('created_at', from).lte('created_at', to),
  ])

  const batches = batchesRes.data ?? []

  // Aggregate per user
  const byUser: Record<string, {
    userId: string; fullName: string; role: string
    batchCount: number; filesUploaded: number; questionsExtracted: number; failedFiles: number
  }> = {}

  for (const b of batches) {
    const uid  = b.created_by ?? 'system'
    const prof = b.profiles as { full_name: string; role: string } | null
    if (!byUser[uid]) {
      byUser[uid] = { userId: uid, fullName: prof?.full_name ?? 'Unknown', role: prof?.role ?? '', batchCount: 0, filesUploaded: 0, questionsExtracted: 0, failedFiles: 0 }
    }
    byUser[uid].batchCount++
    byUser[uid].filesUploaded        += b.total_files               ?? 0
    byUser[uid].questionsExtracted   += b.total_questions_extracted ?? 0
    byUser[uid].failedFiles          += b.failed_files              ?? 0
  }

  return NextResponse.json({
    period: { from, to },
    summary: {
      totalBatches:            batches.length,
      totalFilesUploaded:      batches.reduce((s, b) => s + (b.total_files               ?? 0), 0),
      totalQuestionsExtracted: batches.reduce((s, b) => s + (b.total_questions_extracted ?? 0), 0),
      totalApproved:           approvedRes.data?.length  ?? 0,
      totalRejected:           rejectedRes.data?.length  ?? 0,
      totalAnswersGenerated:   answersRes.data?.length   ?? 0,
      totalPPTDecks:           pptRes.data?.length       ?? 0,
    },
    byUser: Object.values(byUser),
    recentBatches: batches.slice(0, 30).map(b => ({
      id:                  b.id,
      uploadedBy:          (b.profiles as { full_name: string } | null)?.full_name ?? 'Unknown',
      totalFiles:          b.total_files,
      completedFiles:      b.completed_files,
      failedFiles:         b.failed_files,
      questionsExtracted:  b.total_questions_extracted,
      status:              b.status,
      createdAt:           b.created_at,
    })),
    recentPPT: (pptRes.data ?? []).map(p => ({ id: p.id, title: p.title, createdAt: p.created_at })),
  })
}
