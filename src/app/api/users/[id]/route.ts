export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function DELETE(
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

    // Deleting the auth user cascades to the profiles row via FK
    const { error } = await adminClient.auth.admin.deleteUser(params.id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath('/admin/users')
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/users/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
