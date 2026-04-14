export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/cron/backup
 * Daily cron job — runs at 20:00 UTC (midnight UAE).
 * Scheduled in vercel.json: { "path": "/api/cron/backup", "schedule": "0 20 * * *" }
 *
 * 1. Verifies Authorization: Bearer {CRON_SECRET}
 * 2. Backs up all Supabase Storage files to OneDrive
 * 3. Exports a DB snapshot and uploads it to OneDrive
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { uploadToOneDrive } from '@/lib/onedrive-backup'

const STORAGE_BUCKETS: { name: string; onedriveSuffix: string }[] = [
  { name: 'question-images', onedriveSuffix: 'QuestionImages' },
  { name: 'databank',        onedriveSuffix: 'Databank' },
  { name: 'pptx-decks',      onedriveSuffix: 'PPTXDecks' },
]

const DB_TABLES = [
  'topics',
  'subtopics',
  'sub_subtopics',
  'exam_boards',
  'databank_documents',
  'production_targets',
  'profiles',
] as const

const STORAGE_ONEDRIVE_BASE = 'PHA IGCSE Backups/Storage'
const DB_ONEDRIVE_BASE      = 'PHA IGCSE Backups/Database'

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

async function runStorageBackup(supabase: ReturnType<typeof createAdminClient>): Promise<number> {
  let totalFiles = 0

  for (const { name: bucketName, onedriveSuffix } of STORAGE_BUCKETS) {
    const bucket    = supabase.storage.from(bucketName)
    const filePaths = await listAllFiles(bucket)

    for (const filePath of filePaths) {
      try {
        const { data, error } = await bucket.download(filePath)
        if (error || !data) continue

        const buffer   = Buffer.from(await data.arrayBuffer())
        const mimeType = data.type || 'application/octet-stream'
        const dest     = `${STORAGE_ONEDRIVE_BASE}/${onedriveSuffix}/${filePath}`

        await uploadToOneDrive(buffer, dest, mimeType)
        totalFiles++
      } catch (err) {
        console.error(`[cron/backup] storage upload error for ${filePath}:`, err)
      }
    }
  }

  return totalFiles
}

async function runDbSnapshot(supabase: ReturnType<typeof createAdminClient>): Promise<void> {
  const tables: Record<string, unknown[]> = {}

  for (const table of DB_TABLES) {
    const { data } = await supabase.from(table).select('*')
    tables[table]  = data ?? []
  }

  const snapshot = {
    exported_at: new Date().toISOString(),
    note: `Daily cron snapshot — ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
    tables,
  }

  const dateStr   = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const fileName  = `snapshot-${dateStr}.json`
  const dest      = `${DB_ONEDRIVE_BASE}/${fileName}`
  const buffer    = Buffer.from(JSON.stringify(snapshot, null, 2), 'utf8')

  await uploadToOneDrive(buffer, dest, 'application/json')
  console.log(`[cron/backup] DB snapshot uploaded: ${dest}`)
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization') ?? ''
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const startedAt = new Date().toISOString()

  try {
    const [storageCount] = await Promise.all([
      runStorageBackup(supabase),
      runDbSnapshot(supabase),
    ])

    return NextResponse.json({
      success: true,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      storage_files_backed_up: storageCount,
      db_snapshot: 'uploaded',
    })
  } catch (err) {
    console.error('[cron/backup] fatal error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
