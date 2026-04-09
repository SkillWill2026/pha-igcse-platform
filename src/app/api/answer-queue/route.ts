import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('answers')
    .select(`
      id,
      serial,
      content,
      confidence_score,
      status,
      created_at,
      question_id,
      questions (
        id,
        serial,
        content,
        status,
        topics ( name, ref ),
        subtopics ( title )
      )
    `)
    .in('status', ['approved', 'draft'])
    .or('confidence_score.lt.0.7,confidence_score.is.null')
    .order('confidence_score', { ascending: true, nullsFirst: true })
    .limit(200)

  if (error) {
    console.error('Answer queue fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ answers: data })
}
