import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ── POST: Phase 1 only — extract text, store PDF, fire Edge Function ──────────
// Heavy work (OCR + Claude extraction) is done by the Supabase Edge Function.
// This route must complete in < 10s (Vercel Hobby limit).
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const exam_board_id = formData.get('exam_board_id') as string | null
    const topic_id_param = (formData.get('topic_id') as string | null) || null
    const batch_id_param = (formData.get('batch_id') as string | null) || null

    if (!file || !exam_board_id) {
      return NextResponse.json(
        { error: 'Missing required fields: file, exam_board_id' },
        { status: 400 }
      )
    }

    const fileName = file.name.toLowerCase()
    const isPDF = fileName.endsWith('.pdf')
    const isDOCX = fileName.endsWith('.docx')

    if (!isPDF && !isDOCX) {
      return NextResponse.json(
        { error: 'Only PDF (.pdf) and Word (.docx) files are supported' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // ── Fast text extraction (pdf-parse only, no Mistral OCR here) ─────────────
    let textContent = ''
    let isImagePdf = false

    if (isPDF) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string; numpages: number }>
      try {
        const parsed = await pdfParse(buffer)
        textContent = parsed.text
        const avgCharsPerPage = textContent.trim().length / Math.max(parsed.numpages, 1)
        isImagePdf = avgCharsPerPage < 100
        console.log('[ingest] PDF chars:', textContent.trim().length, '| image-based:', isImagePdf)
      } catch (err) {
        console.warn('[ingest] pdf-parse failed, treating as image PDF:', err)
        isImagePdf = true
      }
    } else {
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      textContent = result.value
    }

    // Get authenticated user for created_by attribution
    const serverClient = createServerClient()
    const { data: { user: authUser } } = await serverClient.auth.getUser()

    const supabase = createAdminClient()

    // ── Create or reuse batch record ────────────────────────────────────────────
    let batchId = batch_id_param

    if (!batchId) {
      const isMixTopic = !topic_id_param || topic_id_param === 'mixed'
      const { data: newBatch, error: batchErr } = await supabase
        .from('upload_batches')
        .insert({
          topic_id: isMixTopic ? null : topic_id_param,
          subtopic_id: null,
          sub_subtopic_id: null,
          total_files: 1,
          status: 'processing',
          created_by: authUser?.id ?? null,
        })
        .select('id')
        .single()

      if (batchErr || !newBatch) {
        console.error('[ingest] batch insert failed:', batchErr)
        return NextResponse.json({ error: 'Failed to create batch record' }, { status: 500 })
      }
      batchId = newBatch.id
    } else {
      await supabase
        .from('upload_batches')
        .update({ status: 'processing' })
        .eq('id', batchId)
    }

    // ── Store file to Supabase Storage ──────────────────────────────────────────
    let storagePath: string | null = null
    try {
      const contentType = isPDF
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('pdfs')
        .upload(`${batchId}/${file.name}`, buffer, { contentType, upsert: true })

      if (uploadErr) {
        console.error('[ingest] storage upload failed:', uploadErr.message)
      } else if (uploadData?.path) {
        storagePath = uploadData.path
        console.log('[ingest] stored at:', storagePath)
      }
    } catch (err) {
      console.error('[ingest] storage exception:', err)
    }

    // Update batch with file metadata
    await supabase
      .from('upload_batches')
      .update({
        source_pdf_path: storagePath,
        source_file_name: file.name,
      })
      .eq('id', batchId)

    // ── Fire Supabase Edge Function (fire-and-forget) ───────────────────────────
    // The Edge Function does OCR + Claude extraction async — no Vercel timeout applies.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ''
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
    const edgeFnUrl = `${supabaseUrl}/functions/v1/process-upload`

    const isMixTopic = !topic_id_param || topic_id_param === 'mixed'
    const payload = {
      batch_id: batchId,
      is_image_pdf: isImagePdf,
      text_content: isImagePdf ? '' : textContent.slice(0, 20000),
      topic_id: isMixTopic ? null : topic_id_param,
      exam_board_id,
      file_name: file.name,
    }

    // We await this fetch because the Edge Function returns 200 immediately
    // (it uses EdgeRuntime.waitUntil for background processing)
    try {
      const edgeRes = await fetch(edgeFnUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      })
      if (!edgeRes.ok) {
        const errText = await edgeRes.text()
        console.error('[ingest] Edge Function error:', edgeRes.status, errText)
        await supabase
          .from('upload_batches')
          .update({ status: 'error', error_message: `Edge Function returned ${edgeRes.status}: ${errText.slice(0, 200)}` })
          .eq('id', batchId)
      } else {
        console.log('[ingest] Edge Function accepted job for batch:', batchId)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[ingest] Edge Function call failed:', msg)
      await supabase
        .from('upload_batches')
        .update({ status: 'error', error_message: `Could not reach processing service: ${msg.slice(0, 200)}` })
        .eq('id', batchId)
    }

    return NextResponse.json({ batch_id: batchId, status: 'processing' })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[POST /api/ingest]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
