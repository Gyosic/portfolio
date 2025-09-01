import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/pg";
import { visits } from "@/lib/schema/visit.table";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_agent, referer, pathname } = body;
    const ip =
      (req.headers.get("x-forwarded-for")?.split(",") ?? []).pop() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (process.env.NODE_ENV !== "production") {
      console.debug("[VISITS API]: Visit tracking (dev mode, production only):", {
        user_agent,
        ip,
        referer,
        pathname,
      });
      return NextResponse.json({ success: true, message: "Dev mode, production only" });
    }

    // 데이터베이스에 방문 기록 저장
    await db.insert(visits).values({ user_agent, ip, referer, pathname });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[VISITS API]:", error);
    return NextResponse.json({ error: "Failed to record visit" }, { status: 500 });
  }
}
