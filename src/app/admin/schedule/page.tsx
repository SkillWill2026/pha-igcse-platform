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

  const [{ data: profile }, { data: topicsData, error }, { data: examplesData }] = await Promise.all([
    adminClient.from('profiles').select('role').eq('id', user.id).single(),
    adminClient
      .from('topics')
      .select(`*, subtopics(*, ppt_decks(*))`)
      .order('sort_order', { ascending: true }),
    adminClient
      .from('questions')
      .select('subtopic_id')
      .eq('is_example', true),
  ])

  if (error) {
    console.error('[SchedulePage]', error)
  }

  // Build subtopic_id → example count map
  const examplesMap: Record<string, number> = {}
  for (const q of examplesData ?? []) {
    examplesMap[q.subtopic_id] = (examplesMap[q.subtopic_id] ?? 0) + 1
  }

  const topics: TopicWithSubtopics[] = (topicsData ?? []).map((t) => ({
    ...t,
    subtopics: ((t.subtopics ?? []) as TopicWithSubtopics['subtopics'])
      .map((s) => ({ ...s, examples_count: examplesMap[s.id] ?? 0 }))
      .sort((a, b) => a.sort_order - b.sort_order),
  }))

  const isAdmin = profile?.role === 'admin'

  return (
    <ScheduleClient initialTopics={topics} isAdmin={isAdmin} />
  )
}
