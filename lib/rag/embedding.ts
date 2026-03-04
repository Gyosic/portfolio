const HF_API_KEY = process.env.HF_API_KEY;
const MODEL = "sentence-transformers/all-MiniLM-L6-v2";
const API_URL = `https://router.huggingface.co/hf-inference/models/${MODEL}/pipeline/feature-extraction`;

async function fetchEmbeddings(inputs: string | string[]): Promise<number[][]> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: Array.isArray(inputs) ? inputs : [inputs],
      options: { wait_for_model: true },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`HuggingFace embedding failed (${response.status}): ${err}`);
  }

  return response.json();
}

export async function embedText(text: string): Promise<number[]> {
  const [embedding] = await fetchEmbeddings(text);
  return embedding;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  // HF Inference API can handle batches, but keep reasonable size
  const BATCH_SIZE = 64;
  const results: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const embeddings = await fetchEmbeddings(batch);
    results.push(...embeddings);
  }

  return results;
}
