export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'
import { uploadToOneDrive } from '@/lib/onedrive-backup'

// Actual storage buckets in use in this project.
// Note: spec listed question-images / pdfs / databank-documents;
// real bucket names discovered in codebase are listed here.
const BUCKETS: { name: string; onedriveSuffix: string }[] = [
  { name: 'question-images',  onedriveSuffix: 'QuestionImages' },
  { name: 'databank',         onedriveSuffix: 'Databank' },
  { name: 'pptx-decks',       onedriveSuffix: 'PPTXDecks' },
]

const ONEDRIVE_BASE = 'PHA IGCSE Backups/Storage'

async function requireAdmin(): Promise<{ error: NextResponse | null }> {
  const serverClient = createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const adminClient = createAdminClient()
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Admin access required' }, { status: 403 }) }
  }
  return { error: null }
}

/** Recursively lists all file paths in a Supabase Storage bucket folder. */
async function listAllFiles(
  bucket: ReturnType<ReturnType<typeof createAdminClient>['storage']['from']>,
  folder = ''
): Promise<string[]> {
  const { data, error } = await bucket.list(folder, { limit: 1000 })
  if (error || !data) return []

  const paths: string[] = []
  for (const item of data) {
    const fullPath = folder ? `${folder}/${item.name}` : item.name
    if (item.metadata) {
      // Has metadata → it's a file
      paths.push(fullPath)
    } else {
      // No metadata → it's a folder — recurse
      const nested = await listAllFiles(bucket, fullPath)
      paths.push(...nested)
    }
  }
  return paths
}

export async function GET() {
  const check = await requireAdmin()
  if (check.error) return check.error

  const supabase = createAdminClient()
  let totalFiles = 0
  const results: { bucket: string; files: number; errors: string[] }[] = []

  for (const { name: bucketName, onedriveSuffix } of BUCKETS) {
    const bucket = supabase.storage.from(bucketName)
    const filePaths = await listAllFiles(bucket)
    const errors: string[] = []

    for (const filePath of filePaths) {
      try {
        const { data, error } = await bucket.download(filePath)
        if (error || !data) {
          errors.push(`Download failed: ${filePath} — ${error?.message ?? 'no data'}`)
          continue
        }

        const arrayBuf = await data.arrayBuffer()
        const buffer   = Buffer.from(arrayBuf)
        const mimeType = data.type || 'application/octet-stream'
        const dest     = `${ONEDRIVE_BASE}/${onedriveSuffix}/${filePath}`

        await uploadToOneDrive(buffer, dest, mimeType)
        totalFiles++
      } catch (err) {
        errors.push(`Error backing up ${filePath}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    results.push({ bucket: bucketName, files: filePaths.length - errors.length, errors })
  }

  return NextResponse.json({
    success: true,
    files_backed_up: totalFiles,
    backed_up_at: new Date().toISOString(),
    buckets: results,
  })
}
