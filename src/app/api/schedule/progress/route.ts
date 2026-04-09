export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createAdminClient()

  const [targetRes, topicTargetsRes, topicsRes, approvedRes] = await Promise.all([
    supabase.from('production_targets').select('*').single(),
    supabase.from('production_topic_targets').select('topic_id, target'),
    supabase.from('topics').select('id, ref, name').order('ref'),
    supabase
      .from('questions')
      .select('id, topic_id', { count: 'exact' })
      .eq('status', 'approved')
      .in('id',
        supabase
          .from('answers')
          .select('question_id')
          .eq('status', 'approved')
      ),
  ])

  const target = targetRes.data
  if (!target) {
    return NextResponse.json({ error: 'No production target found' }, { status: 404 })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDate = new Date(target.start_date)
  const endDate = new Date(target.end_date)

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysElapsed = Math.max(0, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
  const daysRemaining = Math.max(1, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

  const approvedCount = approvedRes.count ?? 0
  const remaining = Math.max(0, target.total_target - approvedCount)
  const dynamicDaily = Math.ceil(remaining / daysRemaining)
  const expectedByNow = Math.ceil((target.total_target / totalDays) * daysElapsed)
  const variance = approvedCount - expectedByNow

  const topicTargetMap = Object.fromEntries(
    (topicTargetsRes.data ?? []).map(t => [t.topic_id, t.target])
  )

  const topicCounts: Record<string, number> = {}
  for (const q of approvedRes.data ?? []) {
    if (q.topic_id) {
      topicCounts[q.topic_id] = (topicCounts[q.topic_id] ?? 0) + 1
    }
  }

  const topicBreakdown = (topicsRes.data ?? [])
    .filter(t => t.ref !== 'MIX')
    .map(t => ({
      id: t.id,
      ref: t.ref,
      name: t.name,
      target: topicTargetMap[t.id] ?? 0,
      approved: topicCounts[t.id] ?? 0,
    }))

  const weeklyTarget = dynamicDaily * 7

  return NextResponse.json({
    total_target: target.total_target,
    approved_count: approvedCount,
    remaining,
    start_date: target.start_date,
    end_date: target.end_date,
    days_elapsed: daysElapsed,
    days_remaining: daysRemaining,
    total_days: totalDays,
    dynamic_daily: dynamicDaily,
    weekly_target: weeklyTarget,
    expected_by_now: expectedByNow,
    variance,
    on_track: variance >= 0,
    topic_breakdown: topicBreakdown,
    pct_complete: Math.round((approvedCount / target.total_target) * 100),
  })
}
