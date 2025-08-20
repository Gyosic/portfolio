import { getTableColumns } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/pg";
import { AchievementFormType, achievementFormSchema } from "@/lib/schema/achievement.schema";
import { achievements } from "@/lib/schema/achievement.table";

const achievementColumns = getTableColumns(achievements);

export async function POST(req: NextRequest & NextApiRequest) {
  const achievement: AchievementFormType = await req.json();

  const properties = achievementFormSchema.parse(achievement);

  let result;
  try {
    await db.transaction(async (tx) => {
      const rows = await tx.insert(achievements).values(properties).returning(achievementColumns);

      result = rows[0];
    });

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    const { cause: { code, detail } = {} } = error as { cause: { code?: string; detail?: string } };

    return NextResponse.json(
      { error: { status: 500, message: detail || error, code } },
      { status: !!code ? 400 : 500 },
    );
  }
}
