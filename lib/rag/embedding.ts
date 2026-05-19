import OpenAI from "openai";

const MODEL = "text-embedding-3-small";
const DIMENSIONS = 384;

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function embedText(text: string): Promise<number[]> {
  const client = getClient();
  const res = await client.embeddings.create({ model: MODEL, input: text, dimensions: DIMENSIONS });
  return res.data[0].embedding;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const client = getClient();
  const BATCH_SIZE = 100;
  const results: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const res = await client.embeddings.create({
      model: MODEL,
      input: batch,
      dimensions: DIMENSIONS,
    });
    results.push(...res.data.map((d) => d.embedding));
  }

  return results;
}
