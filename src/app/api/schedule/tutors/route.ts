import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const startOfPeriod = new Date('2026-04-13')
    const endOfPeriod = new Date('2026-07-30')
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const daysLeft = Math.max(1, Math.ceil((endOfPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
    const totalDays = Math.ceil((endOfPeriod.getTime() - startOfPeriod.getTime()) / (1000 * 60 * 60 * 24))
    const daysElapsed = Math.max(0, Math.ceil((today.getTime() - startOfPeriod.getTime()) / (1000 * 60 * 60 * 24)))

    // Parallel: tutors, assignments, topic targets, topics
    const [tutors, assignments, targets, topics] = await Promise.all([
      prisma.profiles.findMany({ where: { role: 'tutor' }, select: { id: true, full_name: true } }),
      prisma.tutor_topic_assignments.findMany({ select: { user_id: true, topic_id: true } }),
      prisma.production_topic_targets.findMany({ select: { topic_id: true, target: true } }),
      prisma.topics.findMany({ select: { id: true, name: true, ref: true } }),
    ])

    const tutorBreakdown = await Promise.all(
      tutors.map(async (tutor) => {
        const topicIds = assignments
          .filter(a => a.user_id === tutor.id)
          .map(a => a.topic_id)

        if (topicIds.length === 0) {
          return {
            id: tutor.id,
            name: tutor.full_name ?? 'Unknown',
            topic_count: 0,
            topic_refs: [] as string[],
            total_target: 0,
            approved: 0,
            pct: 0,
            daily_target: 0,
            status: 'unassigned' as string,
          }
        }

        const tutorTargets = targets.filter(t => topicIds.includes(t.topic_id))
        const totalTarget = tutorTargets.reduce((sum, t) => sum + (t.target ?? 0), 0)
        const topicRefs = topicIds
          .map(id => topics.find(t => t.id === id)?.ref ?? '')
          .filter(Boolean)
          .sort()

        const approvedCount = await prisma.questions.count({
          where: { status: 'approved', topic_id: { in: topicIds } },
        })

        const pct = totalTarget > 0 ? Math.round((approvedCount / totalTarget) * 100) : 0
        const remaining = Math.max(0, totalTarget - approvedCount)
        const dailyTarget = Math.ceil(remaining / daysLeft)
        const expectedByNow = Math.round((daysElapsed / totalDays) * totalTarget)
        const status = approvedCount === 0 ? 'not-started'
          : pct >= 100 ? 'complete'
          : approvedCount >= expectedByNow ? 'on-track'
          : 'behind'

        return {
          id: tutor.id,
          name: tutor.full_name ?? 'Unknown',
          topic_count: topicIds.length,
          topic_refs: topicRefs,
          total_target: totalTarget,
          approved: approvedCount,
          pct,
          daily_target: dailyTarget,
          status,
        }
      })
    )

    return NextResponse.json({ tutors: tutorBreakdown, days_left: daysLeft })
  } catch (error) {
    console.error('Schedule tutors error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
