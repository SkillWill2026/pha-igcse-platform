export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const serverClient = createServerClient()
  const { data: { user: currentUser } } = await serverClient.auth.getUser()
  if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const profile = await prisma.profiles.findUnique({ where: { id: currentUser.id }, select: { role: true } })
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

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
