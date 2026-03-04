import "dotenv/config";
import { Pool } from "pg";
import { postgresql } from "../config";

const pool = new Pool(postgresql);

async function main() {
  // Check indexes
  const idxRes = await pool.query(
    "SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'embeddings'",
  );
  console.log("=== Indexes ===");
  for (const r of idxRes.rows) console.log(r.indexname, "→", r.indexdef);

  // Total count
  const countRes = await pool.query("SELECT count(*) FROM embeddings");
  console.log("\nTotal embeddings:", countRes.rows[0].count);

  // By type
  const typesRes = await pool.query(
    "SELECT source_type, count(*) FROM embeddings GROUP BY source_type ORDER BY source_type",
  );
  console.log("\n=== By type ===");
  for (const r of typesRes.rows) console.log(`  ${r.source_type}: ${r.count}`);

  // Test search (without embedding, just check if basic query works)
  const testRes = await pool.query(
    "SELECT _id, source_type, LEFT(content, 60) as preview FROM embeddings LIMIT 3",
  );
  console.log("\n=== Sample rows ===");
  for (const r of testRes.rows) console.log(`  [${r.source_type}] ${r.preview}`);

  await pool.end();
}

main();
