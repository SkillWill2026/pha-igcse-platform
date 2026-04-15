import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const result = await prisma.question.deleteMany({
    where: { status: 'deleted' }
  })
  return NextResponse.json({ deleted: result.count })
}
