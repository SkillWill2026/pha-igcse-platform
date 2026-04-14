export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { embedTexts, chunkText } from '@/lib/voyage'
import { extractTextWithOCR, isImageBasedPdf } from '@/lib/ocr'

export const maxDuration = 300

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params

  await prisma.databank_documents.update({
    where: { id },
    data: { processing_status: 'processing', processing_error: null },
  })

  try {
    const doc = await prisma.databank_documents.findUnique({
      where: { id },
      select: { file_path: true, title: true },
    })

    if (!doc) throw new Error('Document not found')

    // ── Download from Supabase Storage (unchanged) ────────────────────────────
    const supabase = createAdminClient()
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('databank')
      .download(doc.file_path)

    if (downloadError || !fileData) throw new Error('Failed to download PDF')

    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const pdfParse = (await import('pdf-parse')).default
    const parsed = await pdfParse(buffer)
    const pageCount = parsed.numpages
    let fullText = parsed.text
    let usedOCR = false

    if (isImageBasedPdf(fullText, pageCount)) {
      console.log(`[databank] PDF "${doc.title}" is image-based, using Mistral OCR`)
      fullText = await extractTextWithOCR(buffer)
      usedOCR = true
    }

    await prisma.databank_documents.update({
      where: { id },
      data: { page_count: pageCount },
    })

    const chunks = chunkText(fullText, 2000, 200)

    if (chunks.length === 0) {
      throw new Error(
        usedOCR
          ? 'OCR could not extract text from this PDF. The file may be corrupted or protected.'
          : 'No text could be extracted from PDF'
      )
    }

    // Delete existing chunks (no embedding field involved — regular Prisma ok)
    await prisma.databank_chunks.deleteMany({ where: { document_id: id } })

    const embeddings = await embedTexts(chunks)

    // ── Insert chunks with vector embeddings via raw SQL ──────────────────────
    // Prisma cannot handle the vector type natively — must use $executeRaw
    const batchSize = 50
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batchChunks = chunks.slice(i, i + batchSize)
      const batchEmbeddings = embeddings.slice(i, i + batchSize)

      for (let j = 0; j < batchChunks.length; j++) {
        const content = batchChunks[j]
        const embeddingStr = JSON.stringify(batchEmbeddings[j])
        const chunkIndex = i + j
        const tokenCount = Math.round(content.length / 4)

        await prisma.$executeRaw`
          INSERT INTO databank_chunks (document_id, content, embedding, chunk_index, token_count)
          VALUES (${id}::uuid, ${content}, ${embeddingStr}::vector, ${chunkIndex}, ${tokenCount})
        `
      }
    }

    await prisma.databank_documents.update({
      where: { id },
      data: {
        processing_status: 'completed',
        chunk_count:       chunks.length,
        page_count:        pageCount,
        updated_at:        new Date(),
      },
    })

    return NextResponse.json({
      success:   true,
      chunks:    chunks.length,
      pages:     pageCount,
      ocr_used:  usedOCR,
    })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    await prisma.databank_documents.update({
      where: { id },
      data: {
        processing_status: 'failed',
        processing_error:  message,
        updated_at:        new Date(),
      },
    })

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
