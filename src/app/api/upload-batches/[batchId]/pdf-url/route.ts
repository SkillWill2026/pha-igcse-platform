import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { batchId: string } }
) {
  try {
    const { batchId } = params

    if (!batchId) {
      return NextResponse.json({ error: 'Missing batchId' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Fetch the PDF path from upload_batches
    const { data: batch, error: batchErr } = await supabase
      .from('upload_batches')
      .select('source_pdf_path')
      .eq('id', batchId)
      .single()

    if (batchErr || !batch) {
      return NextResponse.json(
        { error: 'Batch not found' },
        { status: 404 }
      )
    }

    if (!batch.source_pdf_path) {
      return NextResponse.json(
        { error: 'PDF not stored for this batch' },
        { status: 404 }
      )
    }

    // Generate signed URL (1 hour expiry)
    const { data: signedData, error: signErr } = await supabase.storage
      .from('pdfs')
      .createSignedUrl(batch.source_pdf_path, 3600)

    if (signErr || !signedData) {
      console.error('[pdf-url] Failed to generate signed URL:', signErr)
      return NextResponse.json(
        { error: 'Failed to generate PDF URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      url: signedData.signedUrl
    })
  } catch (err) {
    console.error('[GET /api/upload-batches/[batchId]/pdf-url]', err)
    const errMsg = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}
