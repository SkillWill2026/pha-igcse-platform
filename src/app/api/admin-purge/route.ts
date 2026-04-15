import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const result = await prisma.question.deleteMany({
      where: { status: 'deleted' }
    })
    return NextResponse.json({ deleted: result.count })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
