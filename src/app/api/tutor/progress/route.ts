import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabaseUser = createServerClient()
    const { data: { user } } = await supabaseUser.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createAdminClient()

    const now = new Date()
    const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0, 0, 0, 0)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Days remaining until end of production period (Jul 30, 2026)
    const endDate = new Date('2026-07-30')
    const daysLeft = Math.max(1, Math.ceil((endDate.getTime() - startOfDay.getTime()) / (1000 * 60 * 60 * 24)))

    // Get this tutor's assigned topics
    const { data: assignments } = await supabase
      .from('tutor_topic_assignments')
      .select('topic_id')
      .eq('user_id', user.id)

    const topicIds = (assignments ?? []).map(a => a.topic_id)

    // Guard against empty IN clause
    const topicFilter = topicIds.length > 0 ? topicIds : ['00000000-0000-0000-0000-000000000000']

    // Parallel: topics, production targets, time-period counts
    const [topicsRes, prodTargetsRes, todayRes, weekRes, monthRes, totalRes] = await Promise.all([
      supabase.from('topics').select('id, name, ref').in('id', topicFilter),
      supabase.from('production_topic_targets').select('topic_id, target').in('topic_id', topicFilter),
      supabase.from('questions').select('id', { count: 'exact', head: true })
        .eq('status', 'approved').in('topic_id', topicFilter).gte('created_at', startOfDay.toISOString()),
      supabase.from('questions').select('id', { count: 'exact', head: true })
        .eq('status', 'approved').in('topic_id', topicFilter).gte('created_at', startOfWeek.toISOString()),
      supabase.from('questions').select('id', { count: 'exact', head: true })
        .eq('status', 'approved').in('topic_id', topicFilter).gte('created_at', startOfMonth.toISOString()),
      supabase.from('questions').select('id', { count: 'exact', head: true })
        .eq('status', 'approved').in('topic_id', topicFilter),
    ])

    const topics = topicsRes.data ?? []
    const prodTargets = prodTargetsRes.data ?? []

    // Calculate total target from production_topic_targets for assigned topics
    const totalTopicTarget = prodTargets.reduce((sum, p) => sum + (p.target ?? 0), 0)
    const totalApproved = totalRes.count ?? 0
    const remaining = Math.max(0, totalTopicTarget - totalApproved)

    // Dynamic daily target = remaining questions ÷ days left (same formula as production dashboard)
    const dynamicDailyTarget = Math.ceil(remaining / daysLeft)

    // Per-topic breakdown — all parallel
    const topicBreakdown = await Promise.all(
      (assignments ?? []).map(async (assignment) => {
        const topic = topics.find(t => t.id === assignment.topic_id)
        const prodTarget = prodTargets.find(p => p.topic_id === assignment.topic_id)

        const [approvedRes, todayApprovedRes] = await Promise.all([
          supabase.from('questions').select('id', { count: 'exact', head: true })
            .eq('status', 'approved').eq('topic_id', assignment.topic_id),
          supabase.from('questions').select('id', { count: 'exact', head: true })
            .eq('status', 'approved').eq('topic_id', assignment.topic_id)
            .gte('created_at', startOfDay.toISOString()),
        ])

        const topicApproved = approvedRes.count ?? 0
        const topicTarget = prodTarget?.target ?? 0
        const topicRemaining = Math.max(0, topicTarget - topicApproved)
        const topicDailyTarget = Math.ceil(topicRemaining / daysLeft)

        return {
          topic_id: assignment.topic_id,
          topic_name: topic?.name ?? 'Unknown',
          topic_ref: topic?.ref ?? '',
          daily_target: topicDailyTarget,
          total_target: topicTarget,
          total_approved: topicApproved,
          done_today: todayApprovedRes.count ?? 0,
        }
      })
    )

    return NextResponse.json({
      daily_target: dynamicDailyTarget,
      done_today: todayRes.count ?? 0,
      done_week: weekRes.count ?? 0,
      done_month: monthRes.count ?? 0,
      total_approved: totalApproved,
      total_target: totalTopicTarget,
      days_left: daysLeft,
      topic_breakdown: topicBreakdown,
    })
  } catch (error) {
    console.error('Tutor progress error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
