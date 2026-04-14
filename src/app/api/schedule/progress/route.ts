export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const [target, topicTargets, topics] = await Promise.all([
      prisma.production_targets.findFirst({ orderBy: { updated_at: 'desc' } }),
      prisma.production_topic_targets.findMany({ select: { topic_id: true, target: true } }),
      prisma.topics.findMany({ select: { id: true, ref: true, name: true }, orderBy: { ref: 'asc' } }),
    ])

    if (!target) {
      return NextResponse.json({ error: 'No production target found' }, { status: 404 })
    }

    // Get approved answers
    const approvedAnswers = await prisma.answers.findMany({
      where: { status: 'approved' },
      select: { question_id: true },
    })

    const approvedQuestionIds = approvedAnswers.map(a => a.question_id).filter(Boolean) as string[]

    // Get approved questions that also have approved answers
    let approvedCount = 0
    const topicCounts: Record<string, number> = {}

    if (approvedQuestionIds.length > 0) {
      const approvedQuestions = await prisma.questions.findMany({
        where: { status: 'approved', id: { in: approvedQuestionIds } },
        select: { id: true, topic_id: true },
      })

      approvedCount = approvedQuestions.length
      for (const q of approvedQuestions) {
        if (q.topic_id) {
          topicCounts[q.topic_id] = (topicCounts[q.topic_id] ?? 0) + 1
        }
      }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(target.start_date)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(target.end_date)
    endDate.setHours(0, 0, 0, 0)

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysElapsed = Math.max(0, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    const effectiveStart = today < startDate ? startDate : today
    const daysRemaining = Math.max(1, Math.ceil((endDate.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)))

    const remaining = Math.max(0, target.total_target - approvedCount)
    const dynamicDaily = Math.ceil(remaining / daysRemaining)
    const expectedByNow = Math.ceil((target.total_target / totalDays) * daysElapsed)
    const variance = approvedCount - expectedByNow

    const topicTargetMap = Object.fromEntries(topicTargets.map(t => [t.topic_id, t.target]))

    const topicBreakdown = topics
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
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      }
    })

  } catch (err) {
    console.error('[progress] Error:', err)
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Failed to load progress'
    }, { status: 500 })
  }
}
