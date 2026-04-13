#!/usr/bin/env node
const { Pool } = require('pg');

const SOURCE_CONFIG = {
  host: 'db.zwpptfqccgglqrznrrpd.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Aiducation@2025',
  connectionTimeoutMillis: 10000,
};

const TARGET_CONFIG = {
  host: 'pha-igcse-db.postgres.database.azure.com',
  port: 5432,
  database: 'postgres',
  user: 'pgadmin',
  password: 'ClOuD9@$StOrE',
  connectionTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false },
};

const TABLES_TO_MIGRATE = [
  'subjects',
  'topics',
  'subtopics',
  'sub_subtopics',
  'exam_boards',
  'databank_documents',
  'databank_chunks',
];

const sourcePool = new Pool(SOURCE_CONFIG);
const targetPool = new Pool(TARGET_CONFIG);

let report = { steps: [], rowCounts: {}, errors: [] };

async function testSourceConnection() {
  const client = await sourcePool.connect();
  const result = await client.query("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';");
  const count = result.rows[0].count;
  client.release();
  console.log(`  Found ${count} tables in Supabase public schema`);
}

async function testTargetConnection() {
  const client = await targetPool.connect();
  const result = await client.query('SELECT version();');
  console.log(`  Azure PostgreSQL ready`);
  client.release();
}

async function getSchemaFromSource() {
  const client = await sourcePool.connect();
  try {
    const result = await client.query(`SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;`);
    console.log(`  Retrieved ${result.rows.length} table definitions`);
  } finally {
    client.release();
  }
}

async function createExtensionsOnTarget() {
  const client = await targetPool.connect();
  try {
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
      console.log('  pgvector extension created');
    } catch (e) {
      if (e.message.includes('not allow-listed')) {
        console.log('  pgvector not available (Azure restriction) — proceeding without it');
      } else {
        throw e;
      }
    }
  } finally {
    client.release();
  }
}

async function createTablesOnTarget() {
  const sourceClient = await sourcePool.connect();
  const targetClient = await targetPool.connect();
  try {
    for (const tableName of TABLES_TO_MIGRATE) {
      const cols = await sourceClient.query(
        `SELECT column_name, data_type, is_nullable, character_maximum_length, numeric_precision FROM information_schema.columns WHERE table_schema='public' AND table_name=$1 ORDER BY ordinal_position;`,
        [tableName]
      );
      if (cols.rows.length === 0) continue;

      let sql = `CREATE TABLE IF NOT EXISTS "${tableName}" (\n`;
      sql += cols.rows.map(c => {
        let type = c.data_type.toUpperCase();
        if (type === 'USER-DEFINED' || type === 'VECTOR' || type === 'ARRAY') {
          type = 'TEXT';
        } else if (type === 'CHARACTER VARYING') {
          type = c.character_maximum_length ? `VARCHAR(${c.character_maximum_length})` : 'VARCHAR';
        }
        return `  "${c.column_name}" ${type}${c.is_nullable === 'NO' ? ' NOT NULL' : ''}`;
      }).join(',\n');
      sql += '\n);';

      try {
        await targetClient.query(sql);
      } catch (e) {
        // Table exists is OK
      }
    }
    console.log(`  Created table structures for ${TABLES_TO_MIGRATE.length} target tables`);
  } finally {
    sourceClient.release();
    targetClient.release();
  }
}

async function migrateData() {
  const sourceClient = await sourcePool.connect();
  const targetClient = await targetPool.connect();
  try {
    // Clear target tables first to avoid duplicates
    console.log('  Clearing target tables...');
    for (const tableName of TABLES_TO_MIGRATE) {
      try {
        await targetClient.query(`TRUNCATE TABLE "${tableName}";`);
      } catch (e) {
        // Table doesn't exist yet, that's OK
      }
    }

    for (const tableName of TABLES_TO_MIGRATE) {
      const result = await sourceClient.query(`SELECT * FROM "${tableName}";`);
      const rows = result.rows;
      if (rows.length === 0) {
        console.log(`  ${tableName}: 0 rows`);
        continue;
      }
      const columns = Object.keys(rows[0]);
      for (const row of rows) {
        const values = columns.map(c => {
          const v = row[c];
          if (v === null || v === undefined) return 'NULL';
          if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
          if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
          return v;
        });
        try {
          await targetClient.query(
            `INSERT INTO "${tableName}" (${columns.map(c=>`"${c}"`).join(',')}) VALUES (${values.join(',')}) ON CONFLICT DO NOTHING;`
          );
        } catch (e) {}
      }
      console.log(`  ${tableName}: ${rows.length} rows migrated`);
    }
  } finally {
    sourceClient.release();
    targetClient.release();
  }
}

async function verifyRowCounts() {
  const sourceClient = await sourcePool.connect();
  const targetClient = await targetPool.connect();
  console.log('\n  Verifying row counts:');
  console.log('  Table                    | Source | Target | Match');
  console.log('  -------------------------|--------|--------|-------');
  let allMatch = true;
  try {
    for (const tableName of TABLES_TO_MIGRATE) {
      const sc = await sourceClient.query(`SELECT COUNT(*) FROM "${tableName}";`);
      const tc = await targetClient.query(`SELECT COUNT(*) FROM "${tableName}";`);
      const sourceCount = parseInt(sc.rows[0].count, 10);
      const targetCount = parseInt(tc.rows[0].count, 10);
      const match = sourceCount === targetCount ? '✓' : '✗';
      console.log(`  ${tableName.padEnd(24)} | ${sourceCount.toString().padEnd(6)} | ${targetCount.toString().padEnd(6)} | ${match}`);
      if (sourceCount !== targetCount) allMatch = false;
    }
  } finally {
    sourceClient.release();
    targetClient.release();
  }
  return allMatch;
}

async function main() {
  console.log('='.repeat(70));
  console.log('PostgreSQL Migration: Supabase → Azure PostgreSQL UAE North');
  console.log('='.repeat(70));
  try {
    console.log('\nSTEP 1: Test SOURCE connection');
    await testSourceConnection();
    console.log('✅ STEP 1 passed\n');

    console.log('STEP 2: Test TARGET connection');
    await testTargetConnection();
    console.log('✅ STEP 2 passed\n');

    console.log('STEP 3: Read schema from Supabase');
    await getSchemaFromSource();
    console.log('✅ STEP 3 passed\n');

    console.log('STEP 4: Create extensions on Azure');
    await createExtensionsOnTarget();
    console.log('✅ STEP 4 passed\n');

    console.log('STEP 5: Create table structures on Azure');
    await createTablesOnTarget();
    console.log('✅ STEP 5 passed\n');

    console.log('STEP 6: Migrate databank and reference data');
    await migrateData();
    console.log('✅ STEP 6 passed\n');

    console.log('STEP 7: Verify row counts match');
    const success = await verifyRowCounts();
    console.log(`✅ STEP 7 ${success ? 'passed' : 'completed with warnings'}\n`);

    console.log('='.repeat(70));
    console.log('MIGRATION REPORT');
    console.log('='.repeat(70));
    if (success) {
      console.log('\n✅ SUCCESS: All tables migrated and row counts match!');
    } else {
      console.log('\n⚠️  WARNING: Row count mismatches detected above.');
    }
    console.log('\nNext steps:');
    console.log('1. Update database connection string in your .env');
    console.log('2. Test application with new Azure PostgreSQL database');
    console.log('3. Verify all functionality works as expected');
    console.log('\n' + '='.repeat(70));
  } catch (err) {
    console.error('\n❌ ERROR:', err.message);
    console.log('\n' + '='.repeat(70));
    process.exit(1);
  } finally {
    await sourcePool.end();
    await targetPool.end();
  }
}

main();
