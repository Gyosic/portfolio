import { eq, getTableColumns } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/pg";
import { achievementFormSchema } from "@/lib/schema/achievement.schema";
import { achievements } from "@/lib/schema/achievement.table";

type Params = { _id: string };

const achievementColumns = getTableColumns(achievements);

const achievementUpdateFormSchema = achievementFormSchema.partial();
type AchievementUpdateFormType = z.infer<typeof achievementUpdateFormSchema>;

export async function PUT(
  req: NextRequest & NextApiRequest,
  { params }: { params: Promise<Params> },
) {
  const session = await auth();

  if (!session) return NextResponse.json("인증되지 않은 요청입니다.", { status: 401 });

  const { _id } = await params;

  if (!_id) return NextResponse.json({ message: "Device serial_no is required" }, { status: 400 });

  const achievement: AchievementUpdateFormType = await req.json();

  const properties = achievementUpdateFormSchema.parse(achievement);

  let result;
  try {
    await db.transaction(async (tx) => {
      const rows = await tx
        .update(achievements)
        .set(properties)
        .where(eq(achievements._id, _id))
        .returning(achievementColumns);

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

export async function DELETE(
  req: NextRequest & NextApiRequest,
  { params }: { params: Promise<Params> },
) {
  const session = await auth();

  if (!session) return NextResponse.json("인증되지 않은 요청입니다.", { status: 401 });

  const { _id } = await params;

  if (!_id) return NextResponse.json({ message: "Achievement '_id' is required" }, { status: 400 });

  await db.delete(achievements).where(eq(achievements._id, _id));

  return NextResponse.json({ message: "Achievement deleted successfully" }, { status: 200 });
}
