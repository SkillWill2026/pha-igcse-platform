export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, supabase } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const serverClient = createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const profile = await prisma.profiles.findUnique({ where: { id: user.id }, select: { role: true } })
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

  try {
    const adminClient = createAdminClient()

    // Look up the user's email via the admin API
    const { data: { user: targetUser }, error: lookupErr } = await adminClient.auth.admin.getUserById(params.id)
    if (lookupErr || !targetUser?.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Trigger Supabase's built-in password reset email
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(targetUser.email, {
      redirectTo: 'https://pha-igcse-platform.vercel.app/reset-password',
    })
    if (resetErr) {
      return NextResponse.json({ error: resetErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/users/[id]/reset-password]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
