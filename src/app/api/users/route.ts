import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
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
