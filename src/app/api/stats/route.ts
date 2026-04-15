import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
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
    const supabase = createAdminClient()

    let topicIds: string[] = []

    if (subjectId) {
      // Topics live in Supabase — use Supabase client
      const { data: topicsData } = await supabase
        .from('topics')
        .select('id')
        .eq('subject_id', subjectId)

      topicIds = (topicsData ?? []).map(t => t.id)

      if (topicIds.length === 0) {
        return NextResponse.json({ qApproved: 0, qPending: 0, aApproved: 0, aPending: 0 })
      }
    }

    const topicFilter = topicIds.length > 0 ? topicIds : null

    // Question counts from Azure via Prisma
    const [qApproved, qPending] = await Promise.all([
  prisma.questions.count({
    where: {
      status: 'approved',
      ...(topicFilter ? { OR: [{ topic_id: { in: topicFilter } }, { topic_id: null }] } : {}),
    },
  }),
  prisma.questions.count({
    where: {
      status: 'draft',
      ...(topicFilter ? { OR: [{ topic_id: { in: topicFilter } }, { topic_id: null }] } : {}),
    },
  }),
])

    // Answer counts from Azure via Prisma
    let aApproved = 0
    let aPending = 0

    if (topicFilter) {
      const subjectQs = await prisma.questions.findMany({
        where: { topic_id: { in: topicFilter } },
        select: { id: true },
      })
      const questionIds = subjectQs.map(q => q.id)

      if (questionIds.length > 0) {
        const [aApprovedCount, aPendingCount] = await Promise.all([
          prisma.answers.count({ where: { status: 'approved', question_id: { in: questionIds } } }),
          prisma.answers.count({ where: { status: 'draft', question_id: { in: questionIds } } }),
        ])
        aApproved = aApprovedCount
        aPending = aPendingCount
      }
    } else {
      const [aApprovedCount, aPendingCount] = await Promise.all([
        prisma.answers.count({ where: { status: 'approved' } }),
        prisma.answers.count({ where: { status: 'draft' } }),
      ])
      aApproved = aApprovedCount
      aPending = aPendingCount
    }

    return NextResponse.json({ qApproved, qPending, aApproved, aPending })
  } catch (err) {
    console.error('[GET /api/stats]', err)
    return NextResponse.json({ qApproved: 0, qPending: 0, aApproved: 0, aPending: 0 })
  }
}
