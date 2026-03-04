import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { personal } from "@/config";
import { pool } from "@/lib/pg";
import { buildSystemPrompt } from "@/lib/rag/prompt";

export const maxDuration = 30;

async function getAllContexts() {
  const result = await pool.query(
    "SELECT content, source_type FROM embeddings ORDER BY source_type, created_at",
  );
  return result.rows as { content: string; source_type: string }[];
}

export async function POST(req: Request) {
  const { messages, lng = "ko" }: { messages: UIMessage[]; lng?: string } = await req.json();
  const owner = {
    name:
      lng === "ko"
        ? personal.ko.name || "포트폴리오 주인"
        : personal.en.name || "the portfolio owner",
    title: lng === "ko" ? personal.ko.title : personal.en.title,
  };
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

  if (!lastUserMessage) {
    return new Response("No user message found", { status: 400 });
  }

  const contexts = await getAllContexts();
  const systemPrompt = buildSystemPrompt(contexts, lng, owner);

  const result = streamText({
    model: openai(process.env.OPENAI_MODEL || "gpt-4.1-mini"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
