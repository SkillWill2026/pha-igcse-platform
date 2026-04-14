export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'
import { uploadToAzure } from '@/lib/azure-backup'

const BUCKETS: { name: string; azureContainer: string }[] = [
  { name: 'question-images', azureContainer: 'pha-backups-images' },
  { name: 'databank',        azureContainer: 'pha-backups-databank' },
  { name: 'pptx-decks',      azureContainer: 'pha-backups-pdfs' },
]

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
      paths.push(fullPath)
    } else {
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

  for (const { name: bucketName, azureContainer } of BUCKETS) {
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

        const buffer   = Buffer.from(await data.arrayBuffer())
        const mimeType = data.type || 'application/octet-stream'

        await uploadToAzure(buffer, filePath, mimeType, azureContainer)
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
