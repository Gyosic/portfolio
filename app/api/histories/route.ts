import { ColumnDataType, count, getTableColumns, Operators } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { db, selectQuerying } from "@/lib/pg";
import { histories } from "@/lib/schema/history.table";

const historyColumns = getTableColumns(histories);

type FilterType = {
  field: keyof typeof historyColumns;
  operator: keyof Operators;
  value: ColumnDataType;
  or?: boolean;
};
type BodyType = {
  where?: FilterType[];
  sort?: { id: keyof typeof historyColumns; desc: boolean }[];
  pagination?: { pageIndex: number; pageSize: number };
};

export async function POST(req: NextRequest & NextApiRequest) {
  let body: BodyType = {};
  try {
    body = await req.json();
  } catch {}

  const query = db.select(historyColumns).from(histories).$dynamic();

  const { query: selectQuery, whereCondition } = selectQuerying(query, histories, body);

  const rows = await selectQuery;
  const [{ count: rowCount = 0 } = {}] = await db
    .select({ count: count() })
    .from(histories)
    .where(whereCondition);

  return NextResponse.json({ rows, rowCount }, { status: 200 });
}
