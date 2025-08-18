import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { date } from "@/lib/format";
import Fortuneai from "@/lib/fortuneai";
import { db } from "@/lib/pg";
import { fortunes } from "@/lib/schema/fortune.table";

export async function POST(req: NextRequest) {
  const { birth, birthtime, name, gender } = await req.json();

  try {
    const rows = await db.select().from(fortunes).orderBy(desc(fortunes.created_at)).limit(1);

    const [{ created_at, ...todayFortune } = {}] = rows;
    const prevDate = new Date(created_at!);
    const curDate = new Date(date(new Date(), { type: "ymd" }));

    if (!created_at || prevDate < curDate) {
      const fortuneai = new Fortuneai();
      const fortune = await fortuneai.tell({
        birth,
        birthtime,
        name,
        gender,
        userMessage: "오늘의 취업 운세",
      });

      await db.transaction(async (tx) => {
        const returning = await tx.insert(fortunes).values(fortune).returning();
        Object.assign(todayFortune, returning[0]);
      });
    }

    return NextResponse.json(todayFortune);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err || "Internal Server Error" }, { status: 500 });
  }
}
