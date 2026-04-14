export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/backup/trigger
 * Called after each upload batch completes.
 * Body: { batch_id: string }
 *
 * Downloads PDF files for the batch from Supabase Storage and uploads
 * to Azure Blob Storage container 'pha-backups-pdfs' under {batch_id}/{filename}.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { uploadToAzure } from '@/lib/azure-backup'

const AZURE_CONTAINER = 'pha-backups-pdfs'

export async function POST(request: NextRequest) {
  let batch_id: string | undefined

  try {
    const body = await request.json() as { batch_id?: string }
    batch_id = body.batch_id
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!batch_id) {
    return NextResponse.json({ error: 'batch_id is required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Look up all files linked to this batch
  const { data: batchFiles, error: batchError } = await supabase
    .from('upload_batches')
    .select('id, storage_paths')
    .eq('id', batch_id)
    .single()

  if (batchError || !batchFiles) {
    // Fallback: list files in the pdfs bucket under the batch_id prefix
    const bucket = supabase.storage.from('pdfs')
    const { data: listed } = await bucket.list(batch_id, { limit: 1000 })
    const filePaths = (listed ?? [])
      .filter(f => f.metadata)
      .map(f => `${batch_id}/${f.name}`)

    return await backupFiles(filePaths, 'pdfs', batch_id)
  }

  const storagePaths: string[] = Array.isArray(batchFiles.storage_paths)
    ? batchFiles.storage_paths
    : []

  return await backupFiles(storagePaths, 'pdfs', batch_id)
}

async function backupFiles(
  filePaths: string[],
  bucketName: string,
  batchId: string
): Promise<NextResponse> {
  const supabase = createAdminClient()
  const bucket   = supabase.storage.from(bucketName)
  let filesBackedUp = 0
  const errors: string[] = []

  for (const filePath of filePaths) {
    try {
      const { data, error } = await bucket.download(filePath)
      if (error || !data) {
        errors.push(`Download failed: ${filePath} — ${error?.message ?? 'no data'}`)
        continue
      }

      const buffer   = Buffer.from(await data.arrayBuffer())
      const mimeType = data.type || 'application/pdf'
      const fileName = filePath.split('/').pop() ?? filePath
      const blobPath = `${batchId}/${fileName}`

      await uploadToAzure(buffer, blobPath, mimeType, AZURE_CONTAINER)
      filesBackedUp++
    } catch (err) {
      errors.push(`Error backing up ${filePath}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return NextResponse.json({
    success: true,
    files_backed_up: filesBackedUp,
    ...(errors.length > 0 && { errors }),
  })
}
