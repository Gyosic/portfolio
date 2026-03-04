import "dotenv/config";
import { Pool } from "pg";

import { personal, postgresql } from "../config";
import fs from "fs";
import path from "path";
import {
  chunkAchievement,
  chunkEducation,
  chunkHistory,
  chunkMarkdown,
  chunkPdf,
  chunkPersonal,
  chunkProject,
} from "../lib/rag/chunker";
import { embedTexts } from "../lib/rag/embedding";

const pool = new Pool(postgresql);

interface Chunk {
  content: string;
  source_type: string;
  source_id?: string;
  metadata?: Record<string, unknown>;
}

async function main() {
  const client = await pool.connect();

  try {
    // 1. Fetch all portfolio data from DB
    const [projectsRes, historiesRes, educationsRes, achievementsRes] = await Promise.all([
      client.query("SELECT * FROM projects"),
      client.query("SELECT * FROM histories"),
      client.query("SELECT * FROM educations"),
      client.query("SELECT * FROM achievements"),
    ]);

    // 2. Create chunks
    const chunks: Chunk[] = [];

    for (const row of projectsRes.rows) {
      chunks.push(chunkProject(row));
    }
    for (const row of historiesRes.rows) {
      chunks.push(chunkHistory(row));
    }
    for (const row of educationsRes.rows) {
      chunks.push(chunkEducation(row));
    }
    for (const row of achievementsRes.rows) {
      chunks.push(chunkAchievement(row));
    }

    // Personal data from config
    chunks.push(...chunkPersonal(personal));

    // PDF files from documents/ directory
    const docsDir = path.resolve("documents");
    if (fs.existsSync(docsDir)) {
      const files = fs.readdirSync(docsDir);
      for (const file of files) {
        const filePath = path.join(docsDir, file);
        if (file.endsWith(".pdf")) {
          console.log(`📄 Processing PDF: ${file}`);
          chunks.push(...(await chunkPdf(filePath)));
        } else if (file.endsWith(".md") || file.endsWith(".txt")) {
          console.log(`📝 Processing Markdown: ${file}`);
          chunks.push(...chunkMarkdown(filePath));
        }
      }
    }

    if (chunks.length === 0) {
      console.log("No data to embed.");
      return;
    }

    console.log(`📝 Created ${chunks.length} chunks`);

    // 3. Generate embeddings
    const texts = chunks.map((c) => c.content);
    console.log("🔄 Generating embeddings...");
    const allEmbeddings = await embedTexts(texts);
    console.log(`✅ Generated ${allEmbeddings.length} embeddings`);

    // 4. Clear existing embeddings and insert new ones
    await client.query("BEGIN");
    await client.query("DELETE FROM embeddings");

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = allEmbeddings[i];
      const embeddingStr = `[${embedding.join(",")}]`;

      await client.query(
        `INSERT INTO embeddings (content, embedding, source_type, source_id, metadata)
         VALUES ($1, $2::vector, $3, $4, $5)`,
        [
          chunk.content,
          embeddingStr,
          chunk.source_type,
          chunk.source_id || null,
          chunk.metadata ? JSON.stringify(chunk.metadata) : null,
        ],
      );
    }

    await client.query("COMMIT");
    console.log(`✅ Inserted ${chunks.length} embeddings into database`);

    // Verify
    const countRes = await client.query("SELECT count(*) FROM embeddings");
    console.log(`📊 Total embeddings in DB: ${countRes.rows[0].count}`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
