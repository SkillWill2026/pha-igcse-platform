import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const subjectId = request.nextUrl.searchParams.get('subject_id')

    let topicIds: string[] = []

    if (subjectId) {
      const { data: topicsData } = await supabase
        .from('topics')
        .select('id')
        .eq('subject_id', subjectId)
      topicIds = (topicsData ?? []).map((t) => t.id)

      // Subject has no topics — return zeros immediately
      if (topicIds.length === 0) {
        return NextResponse.json({ qApproved: 0, qPending: 0, aApproved: 0, aPending: 0 })
      }
    }

    // Question counts
    const topicFilter = topicIds.length > 0 ? topicIds : null

    const [qApprovedRes, qPendingRes] = await Promise.all([
      topicFilter
        ? supabase.from('questions').select('id', { count: 'exact', head: true }).eq('status', 'approved').in('topic_id', topicFilter)
        : supabase.from('questions').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
      topicFilter
        ? supabase.from('questions').select('id', { count: 'exact', head: true }).eq('status', 'draft').in('topic_id', topicFilter)
        : supabase.from('questions').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    ])

    // Answer counts — need question IDs for subject
    let aApproved = 0
    let aPending = 0

    if (topicFilter) {
      // Get question IDs for this subject's topics
      const { data: subjectQs } = await supabase
        .from('questions')
        .select('id')
        .in('topic_id', topicFilter)

      const questionIds = (subjectQs ?? []).map((q) => q.id)

      if (questionIds.length > 0) {
        const [aApprovedRes, aPendingRes] = await Promise.all([
          supabase.from('answers').select('id', { count: 'exact', head: true }).eq('status', 'approved').in('question_id', questionIds),
          supabase.from('answers').select('id', { count: 'exact', head: true }).eq('status', 'draft').in('question_id', questionIds),
        ])
        aApproved = aApprovedRes.count ?? 0
        aPending = aPendingRes.count ?? 0
      }
    } else {
      const [aApprovedRes, aPendingRes] = await Promise.all([
        supabase.from('answers').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('answers').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
      ])
      aApproved = aApprovedRes.count ?? 0
      aPending = aPendingRes.count ?? 0
    }

    return NextResponse.json({
      qApproved: qApprovedRes.count ?? 0,
      qPending: qPendingRes.count ?? 0,
      aApproved,
      aPending,
    })
  } catch (err) {
    console.error('[GET /api/stats]', err)
    return NextResponse.json({ qApproved: 0, qPending: 0, aApproved: 0, aPending: 0 })
  }
}
