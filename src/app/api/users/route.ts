import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'

export const runtime = 'nodejs'

async function requireAdmin(): Promise<{ error: NextResponse } | { error: null }> {
  const serverClient = createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const adminClient = createAdminClient()
  const { data: profile } = await adminClient.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: NextResponse.json({ error: 'Admin access required' }, { status: 403 }) }
  return { error: null }
}

export async function POST(request: NextRequest) {
  const check = await requireAdmin()
  if (check.error) return check.error

  try {
    const { full_name, email, password, role } =
      await request.json() as {
        full_name: string
        email:     string
        password:  string
        role:      'admin' | 'tutor'
      }

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'email, password and role are required' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Create the auth user
    const { data: { user }, error: authErr } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    })

    if (authErr || !user) {
      return NextResponse.json({ error: authErr?.message ?? 'Failed to create auth user' }, { status: 400 })
    }

    // Insert matching profile row
    const { error: profileErr } = await adminClient
      .from('profiles')
      .insert({ id: user.id, full_name: full_name ?? '', role })

    if (profileErr) {
      // Roll back auth user so we don't leave orphans
      await adminClient.auth.admin.deleteUser(user.id)
      return NextResponse.json({ error: profileErr.message }, { status: 500 })
    }

    revalidatePath('/admin/users')
    return NextResponse.json({ ok: true, user: { id: user.id, email, full_name, role } })
  } catch (err) {
    console.error('[POST /api/users]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
