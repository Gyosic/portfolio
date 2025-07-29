import { ColumnDataType, count, eq, getTableColumns, Operators, or } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, selectQuerying } from "@/lib/pg";
import { firmwares } from "@/lib/schema/firmware.table";

const firmwareColumns = getTableColumns(firmwares);

type FilterType = {
  field: keyof typeof firmwareColumns;
  operator: keyof Operators;
  value: ColumnDataType;
  or?: boolean;
};
type BodyType = {
  where?: FilterType[];
  sort?: { id: keyof typeof firmwareColumns; desc: boolean }[];
  pagination?: { pageIndex: number; pageSize: number };
};

export async function POST(req: NextRequest & NextApiRequest) {
  let body: BodyType = {};
  try {
    body = await req.json();
  } catch {}

  const session = await auth();

  if (!session) return NextResponse.json("인증되지 않은 요청입니다.", { status: 401 });

  const query = db.select(firmwareColumns).from(firmwares).$dynamic();

  const { query: selectQuery, whereCondition } = selectQuerying(query, firmwares, body);

  const rows = await selectQuery;
  const [{ count: rowCount = 0 } = {}] = await db
    .select({ count: count() })
    .from(firmwares)
    .where(whereCondition);

  return NextResponse.json({ rows, rowCount }, { status: 200 });
}
