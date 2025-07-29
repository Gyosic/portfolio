import { and, ColumnDataType, count, eq, getTableColumns, Operators, or } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, selectQuerying } from "@/lib/pg";
import { sites } from "@/lib/schema/site.table";

const siteColumns = getTableColumns(sites);

type FilterType = {
  field: keyof typeof siteColumns;
  operator: keyof Operators;
  value: ColumnDataType;
  or?: boolean;
};
type BodyType = {
  where?: FilterType[];
  sort?: { id: keyof typeof siteColumns; desc: boolean }[];
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

  let query = db.select().from(sites).$dynamic();

  const { query: selectQuery, whereCondition } = selectQuerying(query, sites, body);
  query = selectQuery;
  const where = [whereCondition];

  if (!is_sysadmin) where.push(or(...(userSites?.map(({ _id }) => eq(sites._id, _id)) ?? [])));

  const rows = await query.where(and(...where));

  const [{ count: rowCount = 0 } = {}] = await db
    .select({ count: count() })
    .from(sites)
    .where(and(...where));

  return NextResponse.json({ rows, rowCount }, { status: 200 });
}

// 사이트 onem2m ID 목록 가져오기
export async function GET(req: NextRequest) {
  try {
    const result = await db
      .select({
        _id: sites._id,
        service_name: sites.service_name,
        service_label: sites.service_label,
      })
      .from(sites);

    return NextResponse.json(
      {
        rows: result,
        rowCount: result.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("사이트 ID 목록 조회 오류:", error);

    return NextResponse.json(
      {
        success: false,
        error: "데이터베이스 처리 중 오류가 발생했습니다.",
        code: "DATABASE_ERROR",
      },
      { status: 500 },
    );
  }
}
