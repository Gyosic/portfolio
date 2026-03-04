import "dotenv/config";
import { Pool } from "pg";

import { postgresql } from "../config";

export const pool = new Pool(postgresql);

(async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Enable pgvector extension
    await client.query("CREATE EXTENSION IF NOT EXISTS vector;");

    // Create embeddings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS embeddings (
        _id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT NOT NULL,
        embedding vector(384) NOT NULL,
        source_type TEXT NOT NULL,
        source_id TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Drop old IVFFlat index if exists, use HNSW instead (works well with small datasets)
    await client.query(`DROP INDEX IF EXISTS embeddings_embedding_idx;`);
    await client.query(`
      CREATE INDEX IF NOT EXISTS embeddings_embedding_hnsw_idx
      ON embeddings
      USING hnsw (embedding vector_cosine_ops);
    `);

    await client.query("COMMIT");

    console.log("✅ [pgvector] Extension enabled & embeddings table created");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[pgvector Error]", err);
    throw err;
  } finally {
    client.release();
  }
})().then(() => process.exit(0));
