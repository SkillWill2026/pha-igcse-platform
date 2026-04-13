#!/usr/bin/env node
const { Pool } = require('pg');

const AZURE_CONFIG = {
  host: 'pha-igcse-db.postgres.database.azure.com',
  port: 5432,
  database: 'postgres',
  user: 'pgadmin',
  password: 'ClOuD9@$StOrE',
  connectionTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false },
};

const pool = new Pool(AZURE_CONFIG);

async function runCommand(stepNum, description, sqlCmd) {
  console.log(`\nSTEP ${stepNum}: ${description}`);
  console.log(`  SQL: ${sqlCmd}`);
  try {
    const result = await pool.query(sqlCmd);
    console.log(`  ✅ SUCCESS`);
    if (result.rows && result.rows.length > 0) {
      console.log(`  Result: ${JSON.stringify(result.rows)}`);
    }
    return { success: true, result };
  } catch (err) {
    console.log(`  ❌ ERROR: ${err.message}`);
    return { success: false, error: err.message };
  }
}

async function main() {
  console.log('='.repeat(70));
  console.log('Enable pgvector on Azure PostgreSQL');
  console.log('='.repeat(70));

  try {
    // Step 1: Create extension
    await runCommand(1, 'Create pgvector extension', 'CREATE EXTENSION IF NOT EXISTS vector;');

    // Step 2: Verify extension installed
    const verifyResult = await runCommand(
      2,
      'Verify pgvector extension installed',
      "SELECT * FROM pg_extension WHERE extname = 'vector';"
    );

    if (!verifyResult.success || !verifyResult.result.rows || verifyResult.result.rows.length === 0) {
      console.log('\n⚠️  WARNING: pgvector extension not found. It may not be available on this Azure instance.');
      console.log('   This is a known Azure limitation for non-admin users.');
      process.exit(0);
    }

    // Step 3: Check embedding column type
    const typeResult = await runCommand(
      3,
      'Check embedding column type in databank_chunks',
      'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'databank_chunks\' AND column_name = \'embedding\';'
    );

    if (!typeResult.success || !typeResult.result.rows || typeResult.result.rows.length === 0) {
      console.log('\n⚠️  embedding column not found in databank_chunks');
      process.exit(1);
    }

    const columnType = typeResult.result.rows[0].data_type;
    console.log(`  Current type: ${columnType}`);

    // Step 4: Alter column if it's TEXT
    if (columnType === 'text' || columnType === 'character varying') {
      const alterResult = await runCommand(
        4,
        'Convert embedding column to vector(1536)',
        'ALTER TABLE databank_chunks ALTER COLUMN embedding TYPE vector(1536) USING embedding::vector(1536);'
      );

      if (!alterResult.success) {
        console.log('\n⚠️  Failed to alter column. This might be due to invalid data format.');
        console.log('   Attempting alternative approach...');

        // Try without USING clause
        await runCommand(
          '4b',
          'Convert embedding column to vector(1536) - alternative',
          'ALTER TABLE databank_chunks ALTER COLUMN embedding TYPE vector(1536);'
        );
      }
    } else if (columnType === 'vector') {
      console.log(`  Column is already vector type`);
    } else {
      console.log(`  Unknown column type: ${columnType}`);
    }

    // Step 5: Verify final type
    const finalTypeResult = await runCommand(
      5,
      'Verify embedding column is now vector type',
      'SELECT pg_typeof(embedding)::text as type FROM databank_chunks LIMIT 1;'
    );

    if (finalTypeResult.success && finalTypeResult.result.rows && finalTypeResult.result.rows.length > 0) {
      const finalType = finalTypeResult.result.rows[0].type;
      console.log(`  Final type: ${finalType}`);

      if (finalType && finalType.includes('vector')) {
        console.log('\n✅ SUCCESS: pgvector is now enabled and embedding column is vector type!');
      } else {
        console.log(`\n⚠️  WARNING: embedding column type is ${finalType}, not vector`);
      }
    }

    console.log('\n' + '='.repeat(70));
  } catch (err) {
    console.error('\n❌ FATAL ERROR:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
