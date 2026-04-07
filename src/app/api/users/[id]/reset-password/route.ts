import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const adminClient = createAdminClient()

    // Look up the user's email via the admin API
    const { data: { user }, error: lookupErr } = await adminClient.auth.admin.getUserById(params.id)
    if (lookupErr || !user?.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Trigger Supabase's built-in password reset email
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(user.email, {
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
