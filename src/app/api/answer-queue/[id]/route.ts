export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient()
  const body = await request.json()
  const { content, status } = body

  const updates: Record<string, unknown> = {}
  if (content !== undefined) updates.content = content
  if (status !== undefined) updates.status = status

  const { data, error } = await supabase
    .from('answers')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ answer: data })
}
