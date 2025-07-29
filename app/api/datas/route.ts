import { and, ColumnDataType, count, eq, getTableColumns, inArray, Operators } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, selectQuerying } from "@/lib/pg";
import { datas } from "@/lib/schema/data.table";
import { devices } from "@/lib/schema/device.table";

const dataColumns = getTableColumns(datas);

type FilterType = {
  field: keyof typeof dataColumns;
  operator: keyof Operators;
  value: ColumnDataType;
  or?: boolean;
};

type BodyType = {
  where?: FilterType[];
  sort?: { id: keyof typeof dataColumns; desc: boolean }[];
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

  let query = db
    .select({ ...dataColumns, devices })
    .from(datas)
    .innerJoin(devices, eq(datas.device_serial_no, devices.serial_no))
    .$dynamic();

  const { query: selectQuery, whereCondition } = selectQuerying(query, datas, body);
  query = selectQuery;
  const where = [whereCondition];

  if (!is_sysadmin) {
    const siteIds = userSites?.map(({ _id }) => _id) ?? [];
    if (siteIds.length > 0) {
      where.push(inArray(devices.site_id, siteIds));
    } else {
      return NextResponse.json({ rows: [], rowCount: 0 }, { status: 200 });
    }
  }

  const rows = await query.where(and(...where));

  const [{ count: rowCount = 0 } = {}] = await db
    .select({ count: count() })
    .from(datas)
    .innerJoin(devices, eq(datas.device_serial_no, devices.serial_no))
    .where(and(...where));

  return NextResponse.json({ rows, rowCount }, { status: 200 });
}
