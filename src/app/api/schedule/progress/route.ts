export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createAdminClient()

    const [targetRes, topicTargetsRes, topicsRes] = await Promise.all([
      supabase.from('production_targets').select('*').single(),
      supabase.from('production_topic_targets').select('topic_id, target'),
      supabase.from('topics').select('id, ref, name').order('ref'),
    ])

    if (targetRes.error || !targetRes.data) {
      return NextResponse.json({ error: 'No production target found' }, { status: 404 })
    }

    const target = targetRes.data

    // Get approved answers
    const { data: approvedAnswers, error: answersError } = await supabase
      .from('answers')
      .select('question_id')
      .eq('status', 'approved')

    if (answersError) {
      return NextResponse.json({ error: answersError.message }, { status: 500 })
    }

    const approvedQuestionIds = (approvedAnswers ?? []).map(a => a.question_id).filter(Boolean)

    // Get approved questions that also have approved answers
    let approvedCount = 0
    const topicCounts: Record<string, number> = {}

    if (approvedQuestionIds.length > 0) {
      const { data: approvedQuestions } = await supabase
        .from('questions')
        .select('id, topic_id')
        .eq('status', 'approved')
        .in('id', approvedQuestionIds)

      approvedCount = approvedQuestions?.length ?? 0
      for (const q of approvedQuestions ?? []) {
        if (q.topic_id) {
          topicCounts[q.topic_id] = (topicCounts[q.topic_id] ?? 0) + 1
        }
      }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(target.start_date)
    const endDate = new Date(target.end_date)

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysElapsed = Math.max(0, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    const daysRemaining = Math.max(1, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

    const remaining = Math.max(0, target.total_target - approvedCount)
    const dynamicDaily = Math.ceil(remaining / daysRemaining)
    const expectedByNow = Math.ceil((target.total_target / totalDays) * daysElapsed)
    const variance = approvedCount - expectedByNow

    const topicTargetMap = Object.fromEntries(
      (topicTargetsRes.data ?? []).map(t => [t.topic_id, t.target])
    )

    const topicBreakdown = (topicsRes.data ?? [])
      .filter(t => t.ref !== 'MIX')
      .map(t => ({
        id: t.id,
        ref: t.ref,
        name: t.name,
        target: topicTargetMap[t.id] ?? 0,
        approved: topicCounts[t.id] ?? 0,
      }))

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
      weekly_target: dynamicDaily * 7,
      expected_by_now: expectedByNow,
      variance,
      on_track: variance >= 0,
      topic_breakdown: topicBreakdown,
      pct_complete: Math.round((approvedCount / target.total_target) * 100),
    })

  } catch (err) {
    console.error('[progress] Error:', err)
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Failed to load progress'
    }, { status: 500 })
  }
}
