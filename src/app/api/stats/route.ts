import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const serverSupabase = createServerClient()
  const { data: { user } } = await serverSupabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const subjectId = request.nextUrl.searchParams.get('subject_id')

    let topicIds: string[] = []

    if (subjectId) {
      const topics = await prisma.topics.findMany({
        where: { subject_id: subjectId },
        select: { id: true },
      })
      topicIds = topics.map(t => t.id)

      // Subject has no topics — return zeros immediately
      if (topicIds.length === 0) {
        return NextResponse.json({ qApproved: 0, qPending: 0, aApproved: 0, aPending: 0 })
      }
    }

    const topicFilter = topicIds.length > 0 ? topicIds : null

    // Question counts
    const [qApproved, qPending] = await Promise.all([
      prisma.questions.count({
        where: { status: 'approved', ...(topicFilter ? { topic_id: { in: topicFilter } } : {}) },
      }),
      prisma.questions.count({
        where: { status: 'draft', ...(topicFilter ? { topic_id: { in: topicFilter } } : {}) },
      }),
    ])

    // Answer counts
    let aApproved = 0
    let aPending  = 0

    if (topicFilter) {
      // Get question IDs for this subject's topics
      const subjectQs = await prisma.questions.findMany({
        where: { topic_id: { in: topicFilter } },
        select: { id: true },
      })
      const questionIds = subjectQs.map(q => q.id)

      if (questionIds.length > 0) {
        const [aApprovedCount, aPendingCount] = await Promise.all([
          prisma.answers.count({ where: { status: 'approved', question_id: { in: questionIds } } }),
          prisma.answers.count({ where: { status: 'draft',    question_id: { in: questionIds } } }),
        ])
        aApproved = aApprovedCount
        aPending  = aPendingCount
      }
    } else {
      const [aApprovedCount, aPendingCount] = await Promise.all([
        prisma.answers.count({ where: { status: 'approved' } }),
        prisma.answers.count({ where: { status: 'draft'    } }),
      ])
      aApproved = aApprovedCount
      aPending  = aPendingCount
    }

    return NextResponse.json({ qApproved, qPending, aApproved, aPending })
  } catch (err) {
    console.error('[GET /api/stats]', err)
    return NextResponse.json({ qApproved: 0, qPending: 0, aApproved: 0, aPending: 0 })
  }
}
