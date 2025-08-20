import { ColumnDataType, count, getTableColumns, Operators } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { db, selectQuerying } from "@/lib/pg";
import { achievements } from "@/lib/schema/achievement.table";

const achievementColumns = getTableColumns(achievements);

type FilterType = {
  field: keyof typeof achievementColumns;
  operator: keyof Operators;
  value: ColumnDataType;
  or?: boolean;
};
type BodyType = {
  where?: FilterType[];
  sort?: { id: keyof typeof achievementColumns; desc: boolean }[];
  pagination?: { pageIndex: number; pageSize: number };
};

export async function POST(req: NextRequest & NextApiRequest) {
  let body: BodyType = {};
  try {
    body = await req.json();
  } catch {}

  const query = db.select(achievementColumns).from(achievements).$dynamic();

  const { query: selectQuery, whereCondition } = selectQuerying(query, achievements, body);

  const rows = await selectQuery;
  const [{ count: rowCount = 0 } = {}] = await db
    .select({ count: count() })
    .from(achievements)
    .where(whereCondition);

  return NextResponse.json({ rows, rowCount }, { status: 200 });
}
