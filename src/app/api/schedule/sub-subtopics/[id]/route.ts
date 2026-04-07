import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = createAdminClient()
    const body = await request.json() as Record<string, unknown>
    const allowed = ['ext_num', 'core_num', 'outcome', 'tier', 'notes', 'sort_order']
    const updates: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in body) updates[key] = body[key]
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('sub_subtopics')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ sub_subtopic: data })
  } catch (err) {
    console.error(`[PATCH /api/schedule/sub-subtopics/${params.id}]`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('sub_subtopics')
      .delete()
      .eq('id', params.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(`[DELETE /api/schedule/sub-subtopics/${params.id}]`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
