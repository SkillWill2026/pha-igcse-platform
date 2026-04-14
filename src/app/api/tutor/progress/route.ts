import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const supabaseUser = createServerClient()
    const { data: { user } } = await supabaseUser.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const now = new Date()
    const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0, 0, 0, 0)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Days remaining until end of production period (Jul 30, 2026)
    const endDate = new Date('2026-07-30')
    const daysLeft = Math.max(1, Math.ceil((endDate.getTime() - startOfDay.getTime()) / (1000 * 60 * 60 * 24)))

    // Get this tutor's assigned topics
    const assignments = await prisma.tutor_topic_assignments.findMany({
      where:  { user_id: user.id },
      select: { topic_id: true },
    })

    const topicIds = assignments.map(a => a.topic_id)

    // Guard against empty IN clause (use a non-existent UUID so counts return 0)
    const topicFilter = topicIds.length > 0 ? topicIds : ['00000000-0000-0000-0000-000000000000']

    // Parallel: topics, production targets, time-period counts
    const [topics, prodTargets, todayCount, weekCount, monthCount, totalCount] = await Promise.all([
      prisma.topics.findMany({
        where:  { id: { in: topicFilter } },
        select: { id: true, name: true, ref: true },
      }),
      prisma.production_topic_targets.findMany({
        where:  { topic_id: { in: topicFilter } },
        select: { topic_id: true, target: true },
      }),
      prisma.questions.count({ where: { status: 'approved', topic_id: { in: topicFilter }, created_at: { gte: startOfDay } } }),
      prisma.questions.count({ where: { status: 'approved', topic_id: { in: topicFilter }, created_at: { gte: startOfWeek } } }),
      prisma.questions.count({ where: { status: 'approved', topic_id: { in: topicFilter }, created_at: { gte: startOfMonth } } }),
      prisma.questions.count({ where: { status: 'approved', topic_id: { in: topicFilter } } }),
    ])

    // Calculate total target from production_topic_targets for assigned topics
    const totalTopicTarget = prodTargets.reduce((sum, p) => sum + (p.target ?? 0), 0)
    const totalApproved    = totalCount
    const remaining        = Math.max(0, totalTopicTarget - totalApproved)

    // Dynamic daily target = remaining questions ÷ days left
    const dynamicDailyTarget = Math.ceil(remaining / daysLeft)

    // Per-topic breakdown — all parallel
    const topicBreakdown = await Promise.all(
      assignments.map(async (assignment) => {
        const topic      = topics.find(t => t.id === assignment.topic_id)
        const prodTarget = prodTargets.find(p => p.topic_id === assignment.topic_id)

        const [topicApproved, topicTodayCount] = await Promise.all([
          prisma.questions.count({ where: { status: 'approved', topic_id: assignment.topic_id } }),
          prisma.questions.count({ where: { status: 'approved', topic_id: assignment.topic_id, created_at: { gte: startOfDay } } }),
        ])

        const topicTarget    = prodTarget?.target ?? 0
        const topicRemaining = Math.max(0, topicTarget - topicApproved)
        const topicDailyTarget = Math.ceil(topicRemaining / daysLeft)

        return {
          topic_id:       assignment.topic_id,
          topic_name:     topic?.name ?? 'Unknown',
          topic_ref:      topic?.ref  ?? '',
          daily_target:   topicDailyTarget,
          total_target:   topicTarget,
          total_approved: topicApproved,
          done_today:     topicTodayCount,
        }
      })
    )

    return NextResponse.json({
      daily_target:   dynamicDailyTarget,
      done_today:     todayCount,
      done_week:      weekCount,
      done_month:     monthCount,
      total_approved: totalApproved,
      total_target:   totalTopicTarget,
      days_left:      daysLeft,
      topic_breakdown: topicBreakdown,
    })
  } catch (error) {
    console.error('Tutor progress error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
