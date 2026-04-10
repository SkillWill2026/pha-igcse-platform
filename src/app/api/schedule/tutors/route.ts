import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createAdminClient()

    const startOfPeriod = new Date('2026-04-13')
    const endOfPeriod = new Date('2026-07-30')
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const daysLeft = Math.max(1, Math.ceil((endOfPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
    const totalDays = Math.ceil((endOfPeriod.getTime() - startOfPeriod.getTime()) / (1000 * 60 * 60 * 24))
    const daysElapsed = Math.max(0, Math.ceil((today.getTime() - startOfPeriod.getTime()) / (1000 * 60 * 60 * 24)))

    // Parallel: tutors, assignments, topic targets, topics
    const [profilesRes, assignmentsRes, targetsRes, topicsRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name').eq('role', 'tutor'),
      supabase.from('tutor_topic_assignments').select('user_id, topic_id'),
      supabase.from('production_topic_targets').select('topic_id, target'),
      supabase.from('topics').select('id, name, ref'),
    ])

    const tutors = profilesRes.data ?? []
    const assignments = assignmentsRes.data ?? []
    const targets = targetsRes.data ?? []
    const topics = topicsRes.data ?? []

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

        const { count: approved } = await supabase
          .from('questions')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'approved')
          .in('topic_id', topicIds)

        const approvedCount = approved ?? 0
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
