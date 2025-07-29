import { and, ColumnDataType, count, eq, getTableColumns, Operators, or } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, selectQuerying } from "@/lib/pg";
import { contracts } from "@/lib/schema/contract.table";

const contractColumns = getTableColumns(contracts);

type FilterType = {
  field: keyof typeof contractColumns;
  operator: keyof Operators;
  value: ColumnDataType;
  or?: boolean;
};

type BodyType = {
  where?: FilterType[];
  sort?: { id: keyof typeof contractColumns; desc: boolean }[];
  pagination?: { pageIndex: number; pageSize: number };
};

export async function POST(req: NextRequest & NextApiRequest) {
  let body: BodyType = {};
  try {
    body = await req.json();
  } catch {}

  const session = await auth();

  if (!session) return NextResponse.json("인증되지 않은 요청입니다.", { status: 401 });
  const { user: { is_sysadmin, sites: userSites } = {} } = session;

  try {
    let query = db.select().from(contracts).$dynamic();

    const { query: selectQuery, whereCondition } = selectQuerying(query, contracts, body);
    query = selectQuery;
    const where = [whereCondition];

    if (!is_sysadmin)
      where.push(or(...(userSites?.map(({ _id }) => eq(contracts.site_id, _id)) ?? [])));

    const rows = await query.where(and(...where));
    const [{ count: rowCount = 0 } = {}] = await db
      .select({ count: count() })
      .from(contracts)
      .where(and(...where));

    return NextResponse.json({ rows, rowCount }, { status: 200 });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      {
        error: "Database query failed",
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
