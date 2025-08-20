import { ColumnDataType, count, getTableColumns, Operators } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { db, selectQuerying } from "@/lib/pg";
import { educations } from "@/lib/schema/education.table";

const educationColumns = getTableColumns(educations);

type FilterType = {
  field: keyof typeof educationColumns;
  operator: keyof Operators;
  value: ColumnDataType;
  or?: boolean;
};
type BodyType = {
  where?: FilterType[];
  sort?: { id: keyof typeof educationColumns; desc: boolean }[];
  pagination?: { pageIndex: number; pageSize: number };
};

export async function POST(req: NextRequest & NextApiRequest) {
  let body: BodyType = {};
  try {
    body = await req.json();
  } catch {}

  const query = db.select(educationColumns).from(educations).$dynamic();

  const { query: selectQuery, whereCondition } = selectQuerying(query, educations, body);

  const rows = await selectQuery;
  const [{ count: rowCount = 0 } = {}] = await db
    .select({ count: count() })
    .from(educations)
    .where(whereCondition);

  return NextResponse.json({ rows, rowCount }, { status: 200 });
}
