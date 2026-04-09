import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('databank_documents')
    .select(`
      id,
      title,
      doc_type,
      topic_id,
      file_name,
      file_size,
      page_count,
      chunk_count,
      processing_status,
      processing_error,
      created_at,
      topics ( name, ref )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ documents: data })
}

export async function POST(request: Request) {
  const supabase = createAdminClient()

  const body = await request.json()
  const { title, doc_type, topic_id, file_path, file_name, file_size } = body

  if (!title || !doc_type || !file_path || !file_name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: doc, error: dbError } = await supabase
    .from('databank_documents')
    .insert({
      title,
      doc_type,
      topic_id: topic_id || null,
      file_path,
      file_name,
      file_size: file_size || null,
      processing_status: 'pending',
    })
    .select()
    .single()

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({ document: doc })
}
