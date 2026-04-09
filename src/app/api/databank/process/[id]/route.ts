import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { embedTexts, chunkText } from '@/lib/voyage'

export const maxDuration = 300

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient()
  const { id } = params

  await supabase
    .from('databank_documents')
    .update({ processing_status: 'processing', processing_error: null })
    .eq('id', id)

  try {
    const { data: doc, error: docError } = await supabase
      .from('databank_documents')
      .select('file_path, title')
      .eq('id', id)
      .single()

    if (docError || !doc) throw new Error('Document not found')

    const { data: fileData, error: downloadError } = await supabase.storage
      .from('databank')
      .download(doc.file_path)

    if (downloadError || !fileData) throw new Error('Failed to download PDF')

    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const pdfParse = (await import('pdf-parse')).default
    const parsed = await pdfParse(buffer)

    const pageCount = parsed.numpages
    const fullText = parsed.text

    await supabase
      .from('databank_documents')
      .update({ page_count: pageCount })
      .eq('id', id)

    const chunks = chunkText(fullText, 2000, 200)

    if (chunks.length === 0) throw new Error('No text could be extracted from PDF')

    await supabase
      .from('databank_chunks')
      .delete()
      .eq('document_id', id)

    const embeddings = await embedTexts(chunks)

    const rows = chunks.map((content, i) => ({
      document_id: id,
      content,
      embedding: JSON.stringify(embeddings[i]),
      chunk_index: i,
      token_count: Math.round(content.length / 4),
    }))

    const batchSize = 50
    for (let i = 0; i < rows.length; i += batchSize) {
      const { error: insertError } = await supabase
        .from('databank_chunks')
        .insert(rows.slice(i, i + batchSize))
      if (insertError) throw new Error(`Chunk insert failed: ${insertError.message}`)
    }

    await supabase
      .from('databank_documents')
      .update({
        processing_status: 'completed',
        chunk_count: chunks.length,
        page_count: pageCount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    return NextResponse.json({ success: true, chunks: chunks.length, pages: pageCount })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    await supabase
      .from('databank_documents')
      .update({
        processing_status: 'failed',
        processing_error: message,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
