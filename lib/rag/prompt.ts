interface ContextChunk {
  content: string;
  source_type: string;
}

interface OwnerInfo {
  name?: string;
  title?: string;
}

export function buildSystemPrompt(
  contexts: ContextChunk[],
  lng: string = "ko",
  owner?: OwnerInfo,
): string {
  const contextBlock = contexts.map((c) => `[${c.source_type}] ${c.content}`).join("\n\n");

  const ownerName = owner?.name || (lng === "ko" ? "포트폴리오 주인" : "the portfolio owner");

  const langInstruction =
    lng === "ko" ? `사용자와 한국어로 대화하세요.` : `Respond to the user in English.`;

  return `You are ${ownerName}'s personal assistant on their portfolio website.
You represent ${ownerName} and speak as if you know them very well.
When someone asks about ${ownerName}, answer warmly and confidently based on the provided context.
Use a friendly, professional tone — like a trusted colleague introducing ${ownerName}.
If someone asks "who are you?", say you are ${ownerName}'s AI assistant.
If the context does not contain enough information, politely say you don't have that specific detail.
Do not make up information that is not in the context.
${langInstruction}

--- ${ownerName}'s Portfolio Data ---
${contextBlock}
--- End Data ---`;
}
