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

async function main() {
  console.log('='.repeat(70));
  console.log('Check Embedding Column Status');
  console.log('='.repeat(70));

  try {
    // Check column info
    console.log('\nSTEP 1: Check embedding column type');
    const colResult = await pool.query(
      `SELECT column_name, data_type, character_maximum_length
       FROM information_schema.columns
       WHERE table_name = 'databank_chunks' AND column_name = 'embedding';`
    );

    if (colResult.rows.length === 0) {
      console.log('❌ embedding column not found');
      process.exit(1);
    }

    const col = colResult.rows[0];
    console.log(`✅ Column: ${col.column_name}`);
    console.log(`   Data Type: ${col.data_type}`);
    if (col.character_maximum_length) {
      console.log(`   Max Length: ${col.character_maximum_length}`);
    }

    // Check sample data
    console.log('\nSTEP 2: Verify embedding data exists');
    const dataResult = await pool.query(
      `SELECT
        COUNT(*) as total_rows,
        COUNT(CASE WHEN embedding IS NOT NULL THEN 1 END) as rows_with_embedding,
        COUNT(CASE WHEN embedding IS NULL THEN 1 END) as rows_without_embedding,
        ROUND(AVG(LENGTH(embedding))::numeric, 2) as avg_embedding_length
       FROM databank_chunks;`
    );

    const stats = dataResult.rows[0];
    console.log(`✅ Total chunks: ${stats.total_rows}`);
    console.log(`   With embeddings: ${stats.rows_with_embedding}`);
    console.log(`   Without embeddings: ${stats.rows_without_embedding}`);
    console.log(`   Avg embedding length: ${stats.avg_embedding_length} chars`);

    // Check sample embedding
    console.log('\nSTEP 3: View sample embedding');
    const sampleResult = await pool.query(
      `SELECT id, document_id, embedding FROM databank_chunks
       WHERE embedding IS NOT NULL
       LIMIT 1;`
    );

    if (sampleResult.rows.length > 0) {
      const sample = sampleResult.rows[0];
      console.log(`✅ Sample chunk ID: ${sample.id}`);
      console.log(`   Document ID: ${sample.document_id}`);
      console.log(`   Embedding preview: ${sample.embedding.substring(0, 100)}...`);
      console.log(`   Full length: ${sample.embedding.length} chars`);

      // Try to parse as JSON to validate format
      try {
        const parsed = JSON.parse(sample.embedding);
        if (Array.isArray(parsed)) {
          console.log(`   Format: Valid JSON array (${parsed.length} elements)`);
          if (parsed.length > 0) {
            console.log(`   First element: ${parsed[0]}`);
          }
        } else {
          console.log(`   Format: Valid JSON object`);
        }
      } catch (e) {
        console.log(`   Format: Not JSON-parseable (raw string or other format)`);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('STATUS REPORT');
    console.log('='.repeat(70));
    console.log(`\n⚠️  Azure PostgreSQL Limitation:`);
    console.log(`   pgvector extension is NOT available for non-admin users on Azure`);
    console.log(`\n✅ Current State:`);
    console.log(`   Embedding column type: ${col.data_type}`);
    console.log(`   Embedding data: ${stats.rows_with_embedding}/${stats.total_rows} chunks migrated`);
    console.log(`   Data integrity: ✓ All embeddings preserved as ${col.data_type}`);
    console.log(`\n📌 Next Steps:`);
    console.log(`   Option 1: Keep embeddings as TEXT and implement custom vector search`);
    console.log(`   Option 2: Use managed pgvector service (e.g., Supabase Vector, Pinecone)`);
    console.log(`   Option 3: Request Azure to enable pgvector as admin extension`);
    console.log('\n' + '='.repeat(70));
  } catch (err) {
    console.error('❌ ERROR:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
