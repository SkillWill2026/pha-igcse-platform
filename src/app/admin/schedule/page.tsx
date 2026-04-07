import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { createServerClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import { ScheduleClient } from '@/components/schedule/ScheduleClient'
import type { TopicWithSubtopics } from '@/types/schedule'

export const dynamic = 'force-dynamic'

export default async function SchedulePage() {
  noStore()

  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminClient = createAdminClient()

  const [{ data: profile }, { data: topicsData, error }] = await Promise.all([
    adminClient.from('profiles').select('role').eq('id', user.id).single(),
    adminClient
      .from('topics')
      .select(`*, subtopics(*)`)
      .order('sort_order', { ascending: true }),
  ])

  if (error) {
    console.error('[SchedulePage]', error)
  }

  const topics: TopicWithSubtopics[] = (topicsData ?? []).map((t) => ({
    ...t,
    subtopics: ((t.subtopics ?? []) as TopicWithSubtopics['subtopics']).sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
  }))

  const isAdmin = profile?.role === 'admin'

  return (
    <ScheduleClient initialTopics={topics} isAdmin={isAdmin} />
  )
}
