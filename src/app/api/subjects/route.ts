export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  const serverSupabase = createServerClient()
  const { data: { user } } = await serverSupabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const subjects = await prisma.subjects.findMany({
      where: { active: true },
      select: { id: true, name: true, code: true, color: true, active: true, sort_order: true },
      orderBy: { sort_order: 'asc' },
    })

    return NextResponse.json({ subjects })
  } catch (err) {
    console.error('[GET /api/subjects]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
