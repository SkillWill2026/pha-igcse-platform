import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { block } = await request.json() as { block: boolean }
    const adminClient = createAdminClient()

    const { data: { user }, error } = await adminClient.auth.admin.updateUserById(params.id, {
      // 'none' removes a ban; '876000h' (~100 years) effectively bans permanently
      ban_duration: block ? '876000h' : 'none',
    })

    if (error || !user) {
      return NextResponse.json({ error: error?.message ?? 'Update failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, banned_until: (user as { banned_until?: string | null }).banned_until ?? null })
  } catch (err) {
    console.error('[POST /api/users/[id]/block]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
