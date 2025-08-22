import { getTableColumns } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/pg";
import { HistoryFormType, historyFormSchema } from "@/lib/schema/history.schema";
import { histories } from "@/lib/schema/history.table";

const historyColumns = getTableColumns(histories);

export async function POST(req: NextRequest & NextApiRequest) {
  const session = await auth();

  if (!session) return NextResponse.json("인증되지 않은 요청입니다.", { status: 401 });

  const history: HistoryFormType = await req.json();

  const properties = historyFormSchema.parse(history);

  let result;
  try {
    await db.transaction(async (tx) => {
      const rows = await tx.insert(histories).values(properties).returning(historyColumns);

      result = rows[0];
    });

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    const { cause: { code, detail } = {}, message } = error as {
      cause: { code?: string; detail?: string };
      message?: string;
    };

    return NextResponse.json(
      { error: { status: 500, message: detail || message || error, code } },
      { status: !!code ? 400 : 500 },
    );
  }
}
