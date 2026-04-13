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
  console.log(`\n${'─'.repeat(70)}`);
  console.log(`STEP ${stepNum}: ${description}`);
  console.log(`${'─'.repeat(70)}`);
  console.log(`SQL: ${sqlCmd}`);
  console.log();

  try {
    const result = await pool.query(sqlCmd);
    console.log(`✅ SUCCESS`);

    if (result.rows && result.rows.length > 0) {
      console.log(`\nResult (${result.rows.length} row${result.rows.length !== 1 ? 's' : ''}):`);
      if (result.rows.length <= 5) {
        console.log(JSON.stringify(result.rows, null, 2));
      } else {
        console.log(JSON.stringify(result.rows.slice(0, 5), null, 2));
        console.log(`... and ${result.rows.length - 5} more rows`);
      }
    } else if (result.rowCount !== undefined) {
      console.log(`\nRows affected: ${result.rowCount}`);
    }

    return { success: true, result };
  } catch (err) {
    console.log(`❌ ERROR: ${err.message}`);
    return { success: false, error: err.message };
  }
}

async function main() {
  console.log('╔' + '═'.repeat(68) + '╗');
  console.log('║' + ' '.repeat(68) + '║');
  console.log('║' + '  Enable pgvector on Azure PostgreSQL (Allowlisted)'.padEnd(68) + '║');
  console.log('║' + ' '.repeat(68) + '║');
  console.log('╚' + '═'.repeat(68) + '╝');

  try {
    // Step 1: Create extension
    const step1 = await runCommand(
      1,
      'Create pgvector extension',
      'CREATE EXTENSION IF NOT EXISTS vector;'
    );

    if (!step1.success) {
      console.log('\n⚠️  Cannot create vector extension. It may not be allowlisted yet.');
      console.log('   Continuing to check status...\n');
    }

    // Step 2: Show azure.extensions
    const step2 = await runCommand(
      2,
      'Show allowlisted extensions',
      'SHOW azure.extensions;'
    );

    if (step2.success && step2.result.rows.length > 0) {
      console.log('\nAllowlisted extensions:');
      console.log(step2.result.rows[0].azure_extensions);
    }

    // Step 3: Verify pgvector installed
    const step3 = await runCommand(
      3,
      'Verify pgvector extension installed',
      "SELECT * FROM pg_extension WHERE extname = 'vector';"
    );

    if (!step3.success || !step3.result.rows || step3.result.rows.length === 0) {
      console.log('\n⚠️  pgvector extension not found.');
      console.log('   Please verify the extension is allowlisted in Azure Portal.');
      process.exit(1);
    }

    console.log('\n✅ pgvector extension is installed!');

    // Step 4: Convert embedding column to vector(1024)
    console.log('\n' + '─'.repeat(70));
    console.log('STEP 4: Convert embedding column to vector(1024)');
    console.log('─'.repeat(70));
    console.log('SQL: ALTER TABLE databank_chunks ALTER COLUMN embedding TYPE vector(1024) USING embedding::vector(1024);');
    console.log('\nThis may take a moment...\n');

    try {
      await pool.query(
        'ALTER TABLE databank_chunks ALTER COLUMN embedding TYPE vector(1024) USING embedding::vector(1024);'
      );
      console.log('✅ SUCCESS\n');
      console.log('Embedding column converted to vector(1024)');
    } catch (err) {
      console.log(`❌ ERROR: ${err.message}\n`);
      if (err.message.includes('syntax error') || err.message.includes('invalid')) {
        console.log('Note: The embeddings may not be in the expected format.');
        console.log('Verify the embedding data format in the database.');
      }
      throw err;
    }

    // Step 5: Verify column type
    const step5 = await runCommand(
      5,
      'Verify embedding column is now vector type',
      'SELECT pg_typeof(embedding)::text as type FROM databank_chunks LIMIT 1;'
    );

    if (step5.success && step5.result.rows.length > 0) {
      const type = step5.result.rows[0].type;
      console.log(`\nColumn type confirmed: ${type}`);

      if (type.includes('vector')) {
        console.log('✅ Embedding column is now vector type!');
      }
    }

    // Step 6: Count embeddings
    const step6 = await runCommand(
      6,
      'Count non-null embeddings',
      'SELECT COUNT(*) as embedding_count FROM databank_chunks WHERE embedding IS NOT NULL;'
    );

    if (step6.success && step6.result.rows.length > 0) {
      const count = step6.result.rows[0].embedding_count;
      console.log(`\n✅ ${count} embeddings are stored as vector type`);
    }

    // Final report
    console.log('\n' + '╔' + '═'.repeat(68) + '╗');
    console.log('║' + ' '.repeat(68) + '║');
    console.log('║' + '  ✅ PGVECTOR ENABLEMENT COMPLETE'.padEnd(68) + '║');
    console.log('║' + ' '.repeat(68) + '║');
    console.log('╚' + '═'.repeat(68) + '╝');

    console.log('\nSummary:');
    console.log('  ✅ pgvector extension created');
    console.log('  ✅ Embedding column type: vector(1024)');
    console.log(`  ✅ Total embeddings migrated: ${step6.result.rows[0].embedding_count}`);
    console.log('\nYour Azure PostgreSQL database now supports native vector operations!');
    console.log('Vector similarity search queries will now use pgvector indexes.\n');
  } catch (err) {
    console.log('\n' + '╔' + '═'.repeat(68) + '╗');
    console.log('║' + '  ❌ FATAL ERROR'.padEnd(68) + '║');
    console.log('╚' + '═'.repeat(68) + '╝\n');
    console.error(err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
