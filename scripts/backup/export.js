// scripts/backup/export.js
// Exports selected Supabase tables to a JSON snapshot file.
// Usage: node scripts/backup/export.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const TABLES = [
  'topics',
  'subtopics',
  'sub_subtopics',
  'exam_boards',
  'databank_documents',
  'production_targets',
  'profiles',
];

async function fetchTable(table) {
  const { data, error } = await supabase.from(table).select('*');
  if (error) {
    console.error(`  ERROR fetching ${table}:`, error.message);
    return [];
  }
  console.log(`  ${table}: ${data.length} rows`);
  return data;
}

async function main() {
  console.log('Starting export...\n');

  const tables = {};
  for (const table of TABLES) {
    tables[table] = await fetchTable(table);
  }

  const snapshot = {
    exported_at: new Date().toISOString(),
    note: 'v1.0-stable snapshot — 15 April 2026',
    tables,
  };

  const outPath = path.join(__dirname, 'snapshot-2026-04-15.json');
  fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2), 'utf8');
  console.log(`\nSnapshot saved to: ${outPath}`);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
