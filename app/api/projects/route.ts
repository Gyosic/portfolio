import { ColumnDataType, count, getTableColumns, Operators } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { db, selectQuerying } from "@/lib/pg";
import { projects } from "@/lib/schema/project.table";

const projectColumns = getTableColumns(projects);

type FilterType = {
  field: keyof typeof projectColumns;
  operator: keyof Operators;
  value: ColumnDataType;
  or?: boolean;
};
type BodyType = {
  where?: FilterType[];
  sort?: { id: keyof typeof projectColumns; desc: boolean }[];
  pagination?: { pageIndex: number; pageSize: number };
};

export async function POST(req: NextRequest & NextApiRequest) {
  let body: BodyType = {};
  try {
    body = await req.json();
  } catch {}

  const query = db.select(projectColumns).from(projects).$dynamic();

  const { query: selectQuery, whereCondition } = selectQuerying(query, projects, body);

  const rows = await selectQuery;
  const [{ count: rowCount = 0 } = {}] = await db
    .select({ count: count() })
    .from(projects)
    .where(whereCondition);

  return NextResponse.json({ rows, rowCount }, { status: 200 });
}
