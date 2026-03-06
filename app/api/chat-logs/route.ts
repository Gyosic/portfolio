import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/pg";
import { chatLogs } from "@/lib/schema/chat-log.table";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get("page") || "0");
  const size = Number(searchParams.get("size") || "50");

  const rows = await db
    .select()
    .from(chatLogs)
    .orderBy(desc(chatLogs.created_at))
    .limit(size)
    .offset(page * size);

  return NextResponse.json(rows);
}
