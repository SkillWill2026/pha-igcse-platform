export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('topics')
      .select(`*, subtopics(*)`)
      .order('sort_order', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Collect all subtopic IDs to fetch ppt_decks in one query
    const allSubtopics = (data ?? []).flatMap((t) => t.subtopics ?? [])
    const subtopicIds = allSubtopics.map((s: { id: string }) => s.id)

    // Fetch ppt_decks for all subtopics in parallel with topics sort
    let pptBySubtopic: Record<string, { id: string; status: string; title: string; created_at: string; updated_at: string; slides: unknown[]; tutor_notes: string | null; subject_id: string; subtopic_id: string }[]> = {}

    if (subtopicIds.length > 0) {
      const { data: pptData } = await supabase
        .from('ppt_decks')
        .select('id, subtopic_id, subject_id, title, status, slides, tutor_notes, created_at, updated_at')
        .in('subtopic_id', subtopicIds)
        .order('created_at', { ascending: false })

      if (pptData) {
        for (const deck of pptData) {
          if (!pptBySubtopic[deck.subtopic_id]) pptBySubtopic[deck.subtopic_id] = []
          pptBySubtopic[deck.subtopic_id].push(deck)
        }
      }
    }

    // Attach ppt_decks and sort subtopics
    const topics = (data ?? []).map((t) => ({
      ...t,
      subtopics: (t.subtopics ?? [])
        .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
        .map((s: { id: string }) => ({
          ...s,
          ppt_decks: pptBySubtopic[s.id] ?? [],
        })),
    }))

    return NextResponse.json({ topics })
  } catch (err) {
    console.error('[GET /api/schedule/topics]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      ref: string
      name: string
      subtopic_count: number
      total_questions: number
      ppt_decks: number
      completion_date: string | null
      hours_est: number | null
    }

    const supabase = createAdminClient()

    // Assign sort_order as max + 1
    const { count } = await supabase.from('topics').select('*', { count: 'exact', head: true })
    const sort_order = (count ?? 0) + 1

    const { data, error } = await supabase
      .from('topics')
      .insert({ ...body, sort_order })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ topic: { ...data, subtopics: [] } })
  } catch (err) {
    console.error('[POST /api/schedule/topics]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
