import { eq, getTableColumns } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/pg";
import { historyFormSchema } from "@/lib/schema/history.schema";
import { histories } from "@/lib/schema/history.table";

type Params = { _id: string };

const historyColumns = getTableColumns(histories);

const historyUpdateFormSchema = historyFormSchema.partial();
type HistoryUpdateFormType = z.infer<typeof historyUpdateFormSchema>;

export async function PUT(
  req: NextRequest & NextApiRequest,
  { params }: { params: Promise<Params> },
) {
  const session = await auth();

  if (!session) return NextResponse.json("인증되지 않은 요청입니다.", { status: 401 });

  const { _id } = await params;

  if (!_id) return NextResponse.json({ message: "Device serial_no is required" }, { status: 400 });

  const history: HistoryUpdateFormType = await req.json();

  const properties = historyUpdateFormSchema.parse(history);

  let result;
  try {
    await db.transaction(async (tx) => {
      const rows = await tx
        .update(histories)
        .set(properties)
        .where(eq(histories._id, _id))
        .returning(historyColumns);

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

  if (!_id) return NextResponse.json({ message: "History '_id' is required" }, { status: 400 });

  await db.delete(histories).where(eq(histories._id, _id));

  return NextResponse.json({ message: "History deleted successfully" }, { status: 200 });
}
