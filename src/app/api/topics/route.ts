export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const serverSupabase = createServerClient()
  const { data: { user } } = await serverSupabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const subjectId = request.nextUrl.searchParams.get('subject_id')

  try {
    const data = await prisma.topics.findMany({
      select: { id: true, ref: true, name: true, subject_id: true },
      where: subjectId ? { subject_id: subjectId } : undefined,
      orderBy: { sort_order: 'asc' },
    })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
