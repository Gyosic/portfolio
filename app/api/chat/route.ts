import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { headers } from "next/headers";
import { personal } from "@/config";
import { pool } from "@/lib/pg";
import { buildSystemPrompt } from "@/lib/rag/prompt";

export const maxDuration = 30;

// --- Rate Limiting ---
const RATE_LIMIT = 60; // max requests
const RATE_WINDOW = 60 * 60 * 1000; // per 1 hour

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

async function getAllContexts() {
  const result = await pool.query(
    "SELECT content, source_type FROM embeddings ORDER BY source_type, created_at",
  );
  return result.rows as { content: string; source_type: string }[];
}

export async function POST(req: Request) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
      status: 429,
      headers: { "Content-Type": "application/json", "X-RateLimit-Remaining": "0" },
    });
  }

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

  return result.toUIMessageStreamResponse({
    headers: { "X-RateLimit-Remaining": String(remaining) },
  });
}
