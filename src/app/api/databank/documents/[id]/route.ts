import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient()

  const { data: doc } = await supabase
    .from('databank_documents')
    .select('file_path')
    .eq('id', params.id)
    .single()

  if (doc?.file_path) {
    await supabase.storage.from('databank').remove([doc.file_path])
  }

  const { error } = await supabase
    .from('databank_documents')
    .delete()
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
