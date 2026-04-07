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

  const [{ data: profile }, { data: topicsRaw, error: topicsError }] = await Promise.all([
    adminClient.from('profiles').select('role').eq('id', user.id).single(),
    adminClient
      .from('topics')
      .select(`*, subtopics(*)`)
      .order('sort_order', { ascending: true }),
  ])

  if (topicsError) {
    console.error('[SchedulePage] topics error:', topicsError)
  }

  // Try to fetch ppt_decks per subtopic — this may fail if the table doesn't exist yet
  const pptDecksMap: Record<string, unknown[]> = {}
  try {
    const { data: pptDecks } = await adminClient
      .from('ppt_decks')
      .select('*')
    if (pptDecks) {
      for (const deck of pptDecks) {
        const d = deck as { subtopic_id: string }
        if (!pptDecksMap[d.subtopic_id]) pptDecksMap[d.subtopic_id] = []
        pptDecksMap[d.subtopic_id].push(deck)
      }
    }
  } catch (err) {
    console.error('[SchedulePage] ppt_decks fetch failed (table may not exist yet):', err)
  }

  // Try to fetch example counts per subtopic — may fail if is_example column doesn't exist yet
  const examplesMap: Record<string, number> = {}
  try {
    const { data: examplesData } = await adminClient
      .from('questions')
      .select('subtopic_id')
      .eq('is_example', true)
    for (const q of examplesData ?? []) {
      const row = q as { subtopic_id: string }
      examplesMap[row.subtopic_id] = (examplesMap[row.subtopic_id] ?? 0) + 1
    }
  } catch (err) {
    console.error('[SchedulePage] examples count fetch failed (column may not exist yet):', err)
  }

  const topics: TopicWithSubtopics[] = (topicsRaw ?? []).map((t) => ({
    ...t,
    subtopics: ((t.subtopics ?? []) as TopicWithSubtopics['subtopics'])
      .map((s) => ({
        ...s,
        ppt_decks:      pptDecksMap[s.id] ?? [],
        examples_count: examplesMap[s.id] ?? 0,
      }))
      .sort((a, b) => a.sort_order - b.sort_order),
  }))

  const isAdmin = profile?.role === 'admin'

  return (
    <ScheduleClient initialTopics={topics} isAdmin={isAdmin} />
  )
}
