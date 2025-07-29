import { ColumnDataType, count, eq, getTableColumns, Operators, or } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, selectQuerying } from "@/lib/pg";
import { ltes } from "@/lib/schema/lte.table";

const lteColumns = getTableColumns(ltes);

type FilterType = {
  field: keyof typeof lteColumns;
  operator: keyof Operators;
  value: ColumnDataType;
  or?: boolean;
};
type BodyType = {
  where?: FilterType[];
  sort?: { id: keyof typeof lteColumns; desc: boolean }[];
  pagination?: { pageIndex: number; pageSize: number };
};

export async function POST(req: NextRequest & NextApiRequest) {
  let body: BodyType = {};
  try {
    body = await req.json();
  } catch {}

  const session = await auth();

  if (!session) return NextResponse.json("인증되지 않은 요청입니다.", { status: 401 });

  const query = db.select(lteColumns).from(ltes).$dynamic();

  const { query: selectQuery, whereCondition } = selectQuerying(query, ltes, body);

  const rows = await selectQuery;
  const [{ count: rowCount = 0 } = {}] = await db
    .select({ count: count() })
    .from(ltes)
    .where(whereCondition);

  return NextResponse.json({ rows, rowCount }, { status: 200 });
}
