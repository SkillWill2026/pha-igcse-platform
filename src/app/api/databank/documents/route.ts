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

  const formData = await request.formData()
  const file = formData.get('file') as File
  const title = formData.get('title') as string
  const docType = formData.get('doc_type') as string
  const topicId = formData.get('topic_id') as string | null

  if (!file || !title || !docType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const fileBuffer = await file.arrayBuffer()
  const filePath = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`

  const { error: uploadError } = await supabase.storage
    .from('databank')
    .upload(filePath, fileBuffer, {
      contentType: 'application/pdf',
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: doc, error: dbError } = await supabase
    .from('databank_documents')
    .insert({
      title,
      doc_type: docType,
      topic_id: topicId || null,
      file_path: filePath,
      file_name: file.name,
      file_size: file.size,
      processing_status: 'pending',
    })
    .select()
    .single()

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({ document: doc })
}
