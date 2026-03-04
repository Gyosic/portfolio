import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";
import { personal } from "@/config";
import { auth } from "@/lib/auth";
import FileSystem from "@/lib/fileSystem";
import { pool } from "@/lib/pg";
import {
  type Chunk,
  chunkAchievement,
  chunkEducation,
  chunkHistory,
  chunkMarkdown,
  chunkPdf,
  chunkPersonal,
  chunkProject,
} from "@/lib/rag/chunker";
import { embedTexts } from "@/lib/rag/embedding";

export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    const [projectsRes, historiesRes, educationsRes, achievementsRes] = await Promise.all([
      client.query("SELECT * FROM projects"),
      client.query("SELECT * FROM histories"),
      client.query("SELECT * FROM educations"),
      client.query("SELECT * FROM achievements"),
    ]);

    const chunks: Chunk[] = [];

    for (const row of projectsRes.rows) chunks.push(chunkProject(row));
    for (const row of historiesRes.rows) chunks.push(chunkHistory(row));
    for (const row of educationsRes.rows) chunks.push(chunkEducation(row));
    for (const row of achievementsRes.rows) chunks.push(chunkAchievement(row));
    chunks.push(...chunkPersonal(personal));

    // PDF / Markdown / TXT files from FileSystem storage
    const fileSystem = new FileSystem({ storageName: "documents" });
    const docsDir = fileSystem.storageAbsolutePathname();
    if (fs.existsSync(docsDir)) {
      const files = fs.readdirSync(docsDir).filter((f) => {
        const ext = path.extname(f).toLowerCase();
        return [".pdf", ".md", ".txt"].includes(ext);
      });
      for (const file of files) {
        const filePath = path.join(docsDir, file);
        if (file.endsWith(".pdf")) {
          chunks.push(...(await chunkPdf(filePath)));
        } else if (file.endsWith(".md") || file.endsWith(".txt")) {
          chunks.push(...chunkMarkdown(filePath));
        }
      }
    }

    if (chunks.length === 0) {
      return NextResponse.json({ message: "No data to embed", count: 0 });
    }

    const texts = chunks.map((c) => c.content);
    const allEmbeddings = await embedTexts(texts);

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

    return NextResponse.json({
      message: "Embeddings generated successfully",
      count: chunks.length,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Embedding error:", err);
    return NextResponse.json({ error: "Failed to generate embeddings" }, { status: 500 });
  } finally {
    client.release();
  }
}
