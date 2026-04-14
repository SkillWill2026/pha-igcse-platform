import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { message?: string; stack?: string; url?: string }

    await prisma.error_logs.create({
      data: {
        message:    body.message ?? null,
        stack:      body.stack ?? null,
        url:        body.url ?? null,
        user_agent: request.headers.get('user-agent') ?? null,
        created_at: new Date(),
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
