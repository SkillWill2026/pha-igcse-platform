export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createAdminClient()

  const [assignmentsRes, topicsRes, subjectsRes] = await Promise.all([
    supabase
      .from('tutor_topic_assignments')
      .select('id, user_id, topic_id, subject_id'),
    supabase
      .from('topics')
      .select('id, name, ref, subject_id')
      .order('ref'),
    supabase
      .from('subjects')
      .select('id, name, code, color')
      .eq('active', true)
      .order('sort_order'),
  ])

  return NextResponse.json({
    assignments: assignmentsRes.data ?? [],
    topics: topicsRes.data ?? [],
    subjects: subjectsRes.data ?? [],
  })
}

export async function POST(request: Request) {
  const supabase = createAdminClient()
  const { user_id, topic_id, subject_id } = await request.json()

  if (!user_id || !topic_id || !subject_id) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { error } = await supabase
    .from('tutor_topic_assignments')
    .upsert({ user_id, topic_id, subject_id }, { onConflict: 'user_id,topic_id' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const supabase = createAdminClient()
  const { user_id, topic_id } = await request.json()

  if (!user_id || !topic_id) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { error } = await supabase
    .from('tutor_topic_assignments')
    .delete()
    .eq('user_id', user_id)
    .eq('topic_id', topic_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
