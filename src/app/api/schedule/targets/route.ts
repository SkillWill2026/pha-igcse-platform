export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  const supabase = createAdminClient()
  const body = await request.json()
  const { total_target, topic_targets } = body

  if (total_target !== undefined) {
    const { error } = await supabase
      .from('production_targets')
      .update({ total_target, updated_at: new Date().toISOString() })
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  if (topic_targets && Array.isArray(topic_targets)) {
    for (const tt of topic_targets) {
      const { error } = await supabase
        .from('production_topic_targets')
        .update({ target: tt.target, updated_at: new Date().toISOString() })
        .eq('topic_id', tt.topic_id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ success: true })
}
