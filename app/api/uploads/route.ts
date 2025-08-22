import { ColumnDataType, count, getTableColumns, Operators } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { db, selectQuerying } from "@/lib/pg";
import { uploads } from "@/lib/schema/upload.table";

const uploadColumns = getTableColumns(uploads);

type FilterType = {
  field: keyof typeof uploadColumns;
  operator: keyof Operators;
  value: ColumnDataType;
  or?: boolean;
};
type BodyType = {
  where?: FilterType[];
  sort?: { id: keyof typeof uploadColumns; desc: boolean }[];
  pagination?: { pageIndex: number; pageSize: number };
};

export async function POST(req: NextRequest & NextApiRequest) {
  let body: BodyType = {};
  try {
    body = await req.json();
  } catch {}

  const query = db.select(uploadColumns).from(uploads).$dynamic();

  const { query: selectQuery, whereCondition } = selectQuerying(query, uploads, body);

  const rows = await selectQuery;
  const [{ count: rowCount = 0 } = {}] = await db
    .select({ count: count() })
    .from(uploads)
    .where(whereCondition);

  return NextResponse.json({ rows, rowCount }, { status: 200 });
}
