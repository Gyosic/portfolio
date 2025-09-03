import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import Fortuneai from "@/lib/fortuneai";
import { db } from "@/lib/pg";
import { fortunes } from "@/lib/schema/fortune.table";

const timezone = process.env.TIMEZONE || "ko-KR";

const fortuning = async (info: {
  birth: string;
  birthtime: string;
  name: string;
  gender: string;
}) => {
  const fortuneai = new Fortuneai();
  const fortune = await fortuneai.tell({ ...info, userMessage: "오늘의 취업 운세" });

  const returning = await db.insert(fortunes).values(fortune).returning();

  return returning[0];
};

export async function POST(req: NextRequest) {
  const { birth, birthtime, name, gender } = await req.json();

  try {
    const rows = await db.select().from(fortunes).orderBy(desc(fortunes.created_at)).limit(1);

    if (!rows || !rows.length) {
      const fortune = await fortuning({ birth, birthtime, name, gender });
      return NextResponse.json(fortune);
    }

    const [{ created_at, ...todayFortune }] = rows;
    const prevDate = new Intl.DateTimeFormat(timezone).format(new Date(created_at!));
    const curDate = new Intl.DateTimeFormat(timezone).format(new Date());

    if (prevDate !== curDate) {
      const fortune = await fortuning({ birth, birthtime, name, gender });

      Object.assign(todayFortune, fortune);
    }

    return NextResponse.json({ created_at, ...todayFortune });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err || "Internal Server Error" }, { status: 500 });
  }
}
