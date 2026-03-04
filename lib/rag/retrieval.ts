import { pool } from "@/lib/pg";
import { embedText } from "./embedding";

export interface RetrievedChunk {
  _id: string;
  content: string;
  source_type: string;
  source_id: string | null;
  metadata: unknown;
  distance: number;
}

export async function retrieveRelevant(
  query: string,
  topK = 5,
): Promise<RetrievedChunk[]> {
  try {
    console.log("[Retrieval] Starting embed for:", query);
    const queryEmbedding = await embedText(query);
    console.log("[Retrieval] Embedding length:", queryEmbedding.length);
    const embeddingStr = `[${queryEmbedding.join(",")}]`;

    const countResult = await pool.query("SELECT count(*) FROM embeddings");
    console.log("[Retrieval] Total rows in embeddings:", countResult.rows[0].count);

    const result = await pool.query(
      `SELECT _id, content, source_type, source_id, metadata,
              embedding <=> $1::vector AS distance
       FROM embeddings
       ORDER BY embedding <=> $1::vector ASC
       LIMIT $2`,
      [embeddingStr, topK],
    );

    console.log("[Retrieval] Query returned rows:", result.rows.length);
    return result.rows as RetrievedChunk[];
  } catch (err) {
    console.error("[Retrieval] Error:", err);
    return [];
  }
}
