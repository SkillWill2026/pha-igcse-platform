export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Fetch file_path for storage cleanup
    const doc = await prisma.databank_documents.findUnique({
      where: { id: params.id },
      select: { file_path: true },
    })

    // Remove from Supabase Storage if path exists
    if (doc?.file_path) {
      const supabase = createAdminClient()
      await supabase.storage.from('databank').remove([doc.file_path])
    }

    await prisma.databank_documents.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(`[DELETE /api/databank/documents/${params.id}]`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
