// scripts/migrate-to-azure.js
// Migrates data from Supabase → Azure PostgreSQL.
// Run with: node scripts/migrate-to-azure.js

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
const { Client }       = require('pg')

// ── Clients ───────────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const pg = new Client({
  host:     process.env.AZURE_PG_HOST,
  database: 'postgres',
  user:     process.env.AZURE_PG_USER,
  password: process.env.AZURE_PG_PASSWORD,
  ssl:      { rejectUnauthorized: false },
})

// ── DDL — create missing tables ───────────────────────────────────────────────

const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY,
  role        TEXT DEFAULT 'tutor',
  full_name   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_text     TEXT,
  difficulty       TEXT,
  marks            INTEGER,
  topic_id         UUID,
  subtopic_id      UUID,
  sub_subtopic_id  UUID,
  exam_board_id    UUID,
  status           TEXT DEFAULT 'draft',
  batch_id         UUID,
  created_by       UUID,
  has_image        BOOLEAN DEFAULT FALSE,
  question_number  INTEGER,
  source_page      INTEGER,
  year             INTEGER,
  paper            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS answers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id  UUID,
  content_text TEXT,
  status       TEXT DEFAULT 'draft',
  created_by   UUID,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ppt_decks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT,
  subtopic_id UUID,
  status      TEXT DEFAULT 'draft',
  slides      JSONB,
  created_by  UUID,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
`

// ── Fix 2: Add primary keys to existing Azure tables that are missing them ────
// Each ALTER is tried individually; if the PK already exists the error is caught
// and skipped silently.

const PK_TABLES = [
  'topics',
  'subtopics',
  'sub_subtopics',
  'exam_boards',
  'databank_documents',
  'databank_chunks',
  'production_targets',
  'upload_batches',
  'question_images',
]

async function ensurePrimaryKeys() {
  console.log('Ensuring primary keys on existing Azure tables...')
  for (const table of PK_TABLES) {
    try {
      await pg.query(`ALTER TABLE ${table} ADD PRIMARY KEY (id)`)
      console.log(`  ✅ Added PRIMARY KEY to ${table}`)
    } catch (err) {
      if (err.message.includes('already exists') || err.message.includes('multiple primary keys')) {
        console.log(`  ⏭  ${table} — primary key already exists, skipping`)
      } else if (err.message.includes('does not exist')) {
        console.log(`  ⏭  ${table} — table does not exist, skipping`)
      } else {
        console.log(`  ⚠️  ${table} — ${err.message}`)
      }
    }
  }
  console.log('✅ Primary key pass complete\n')
}

// ── Generic upsert builder (used by most tables) ──────────────────────────────

function buildGenericUpsert(tableName, row) {
  const cols    = Object.keys(row)
  const vals    = Object.values(row)
  const params  = cols.map((_, i) => `$${i + 1}`)
  const updates = cols.filter(c => c !== 'id').map(c => `${c} = EXCLUDED.${c}`)
  return {
    sql: `INSERT INTO ${tableName} (${cols.join(', ')}) VALUES (${params.join(', ')})
          ON CONFLICT (id) DO UPDATE SET ${updates.join(', ')}`,
    values: vals,
  }
}

// ── Tables to migrate (Supabase → Azure) ──────────────────────────────────────

const TABLES = [
  {
    name:         'profiles',
    fetchColumns: '*',
    // Fix 1: columns discovered at runtime from actual Supabase schema
    dynamic: true,
  },
  { name: 'topics',               fetchColumns: '*' },
  { name: 'subtopics',            fetchColumns: '*' },
  { name: 'sub_subtopics',        fetchColumns: '*' },
  { name: 'exam_boards',          fetchColumns: '*' },
  { name: 'databank_documents',   fetchColumns: '*' },
  { name: 'production_targets',   fetchColumns: '*' },
  {
    name:         'ppt_decks',
    fetchColumns: 'id, title, subtopic_id, status, slides, created_by, created_at, updated_at',
    buildUpsert(row) {
      return {
        sql: `INSERT INTO ppt_decks (id, title, subtopic_id, status, slides, created_by, created_at, updated_at)
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
              ON CONFLICT (id) DO UPDATE SET
                title       = EXCLUDED.title,
                subtopic_id = EXCLUDED.subtopic_id,
                status      = EXCLUDED.status,
                slides      = EXCLUDED.slides,
                updated_at  = EXCLUDED.updated_at`,
        values: [
          row.id, row.title, row.subtopic_id, row.status,
          row.slides ? JSON.stringify(row.slides) : null,
          row.created_by, row.created_at, row.updated_at,
        ],
      }
    },
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getAzureCount(tableName) {
  const res = await pg.query(`SELECT COUNT(*) FROM ${tableName}`)
  return parseInt(res.rows[0].count, 10)
}

// Fix 1: for dynamic tables (profiles), ensure the Azure table has all columns
// that exist in Supabase, adding any that are missing.
async function syncProfilesSchema(sampleRow) {
  const cols = Object.keys(sampleRow)
  for (const col of cols) {
    if (col === 'id') continue
    try {
      await pg.query(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ${col} TEXT`)
      console.log(`  + Added column: ${col}`)
    } catch {
      // Column likely already exists with correct type — ignore
    }
  }
}

async function migrateTable(table) {
  console.log(`\n── ${table.name} ──`)

  // Fetch all rows from Supabase
  const { data, error } = await supabase
    .from(table.name)
    .select(table.fetchColumns)

  if (error) {
    console.error(`  ❌ Supabase fetch error: ${error.message}`)
    return { table: table.name, supabase: null, azure: null, match: false }
  }

  const rows = data ?? []
  console.log(`  Supabase: ${rows.length} rows`)

  if (rows.length === 0) {
    const azureCount = await getAzureCount(table.name)
    console.log(`  Azure:    ${azureCount} rows`)
    const match = azureCount === 0
    console.log(`  ${match ? '✅ match' : '⚠️  Azure has rows but Supabase is empty'}`)
    return { table: table.name, supabase: 0, azure: azureCount, match }
  }

  // Fix 1: for profiles (dynamic), sync schema from actual Supabase columns
  if (table.dynamic) {
    console.log(`  Detected columns: ${Object.keys(rows[0]).join(', ')}`)
    await syncProfilesSchema(rows[0])
  }

  // Upsert each row
  let inserted = 0
  let failed   = 0
  for (const row of rows) {
    try {
      const { sql, values } = table.buildUpsert
        ? table.buildUpsert(row)
        : buildGenericUpsert(table.name, row)
      await pg.query(sql, values)
      inserted++
    } catch (err) {
      console.error(`  ⚠️  Row upsert failed (${row.id ?? '?'}): ${err.message}`)
      failed++
    }
  }
  console.log(`  Upserted: ${inserted} rows${failed > 0 ? `, ${failed} failed` : ''}`)

  // Verify counts match
  const azureCount = await getAzureCount(table.name)
  console.log(`  Azure:    ${azureCount} rows`)
  const match = azureCount === rows.length
  console.log(`  ${match ? '✅ match' : `❌ mismatch — expected ${rows.length}, got ${azureCount}`}`)

  return { table: table.name, supabase: rows.length, azure: azureCount, match }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Connecting to Azure PostgreSQL...')
  await pg.connect()
  console.log('✅ Connected\n')

  // Step 1: Create missing tables
  console.log('Creating missing tables (IF NOT EXISTS)...')
  await pg.query(CREATE_TABLES_SQL)
  console.log('✅ DDL applied\n')

  // Step 2: Ensure primary keys on existing tables (Fix 2)
  await ensurePrimaryKeys()

  // Step 3: Migrate each table
  const summary = []
  for (const table of TABLES) {
    const result = await migrateTable(table)
    summary.push(result)
  }

  // Step 4: Migrate databank_chunks (batched, vectors)
  const chunksResult = await migrateDatabank_chunks()
  summary.push(chunksResult)

  // Step 5: Print summary
  console.log('\n════════════════════════════════')
  console.log('MIGRATION SUMMARY')
  console.log('════════════════════════════════')
  for (const r of summary) {
    const status = r.match ? '✅' : '❌'
    const counts = r.supabase !== null
      ? `Supabase: ${r.supabase} → Azure: ${r.azure}`
      : 'skipped'
    console.log(`${status} ${r.table.padEnd(25)} ${counts}`)
  }
  console.log('════════════════════════════════')

  await pg.end()
}

async function migrateDatabank_chunks() {
  console.log('\n── databank_chunks ──')

  // Fetch all rows from Supabase
  const { data, error } = await supabase
    .from('databank_chunks')
    .select('id, document_id, content, embedding, page_number, chunk_index, token_count, created_at')

  if (error) {
    console.error(`  ❌ Supabase fetch error: ${error.message}`)
    return { table: 'databank_chunks', supabase: null, azure: null, match: false }
  }

  const rows = data ?? []
  console.log(`  Supabase: ${rows.length} rows`)

  const BATCH_SIZE = 50
  const totalBatches = Math.ceil(rows.length / BATCH_SIZE)
  let totalInserted = 0
  let totalFailed   = 0

  for (let b = 0; b < totalBatches; b++) {
    const batch  = rows.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE)
    let batchOk  = 0
    let batchFail = 0

    for (const row of batch) {
      try {
        await pg.query(
          `INSERT INTO databank_chunks
             (id, document_id, content, embedding, page_number, chunk_index, token_count, created_at)
           VALUES ($1,$2,$3,$4::vector,$5,$6,$7,$8)
           ON CONFLICT (id) DO UPDATE SET
             document_id = EXCLUDED.document_id,
             content     = EXCLUDED.content,
             embedding   = EXCLUDED.embedding,
             page_number = EXCLUDED.page_number,
             chunk_index = EXCLUDED.chunk_index,
             token_count = EXCLUDED.token_count`,
          [row.id, row.document_id, row.content, row.embedding,
           row.page_number, row.chunk_index, row.token_count, row.created_at]
        )
        batchOk++
      } catch (err) {
        console.error(`  ⚠️  Row failed (${row.id}): ${err.message}`)
        batchFail++
      }
    }

    totalInserted += batchOk
    totalFailed   += batchFail
    console.log(`  Batch ${b + 1}/${totalBatches} — ${batchOk} rows upserted${batchFail > 0 ? `, ${batchFail} failed` : ''}`)
  }

  console.log(`  Total upserted: ${totalInserted}${totalFailed > 0 ? `, ${totalFailed} failed` : ''}`)

  const azureCount = await getAzureCount('databank_chunks')
  console.log(`  Azure:    ${azureCount} rows`)
  const match = azureCount === rows.length
  console.log(`  ${match ? '✅ match' : `❌ mismatch — expected ${rows.length}, got ${azureCount}`}`)

  return { table: 'databank_chunks', supabase: rows.length, azure: azureCount, match }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
