import {
  and,
  ColumnDataType,
  count,
  desc,
  eq,
  getTableColumns,
  Operators,
  or,
  sql,
} from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, selectQuerying } from "@/lib/pg";
import { datas } from "@/lib/schema/data.table";
import { devices } from "@/lib/schema/device.table";
import { sites } from "@/lib/schema/site.table";

const deviceColumns = getTableColumns(devices);
const siteColumns = getTableColumns(sites);
const dataColumns = getTableColumns(datas);

type FilterType = {
  field: keyof typeof deviceColumns;
  operator: keyof Operators;
  value: ColumnDataType;
  or?: boolean;
};

type JoinDatasFilterType = {
  field: keyof typeof dataColumns;
  operator: keyof Operators;
  value: ColumnDataType;
  or?: boolean;
};

type JoinSitesFilterType = {
  field: keyof typeof siteColumns;
  operator: keyof Operators;
  value: ColumnDataType;
  or?: boolean;
};

type BodyType = {
  where?: FilterType[];
  sort?: { id: keyof typeof deviceColumns; desc: boolean }[];
  pagination?: { pageIndex: number; pageSize: number };
  join?: {
    datas: {
      where?: JoinDatasFilterType[];
      sort?: { id: keyof typeof dataColumns; desc: boolean }[];
    };
    sites: {
      where?: JoinSitesFilterType[];
      sort?: { id: keyof typeof siteColumns; desc: boolean }[];
    };
  };
};

export async function POST(req: NextRequest & NextApiRequest) {
  let body: BodyType = {};
  try {
    body = await req.json();
  } catch {}

  const session = await auth();

  if (!session) return NextResponse.json("인증되지 않은 요청입니다.", { status: 401 });
  const { user: { is_sysadmin, sites: userSites } = {} } = session;

  let lateralDatasJoin = db.select().from(datas).limit(1).$dynamic();
  let lateralSitesJoin = db.select().from(sites).$dynamic();

  const datasJoinOrderConditions = [desc(datas.timestamp)];
  const datasJoinWhereConditions = [eq(datas.device_serial_no, devices.serial_no)];
  const sitesJoinOrderConditions = [];
  const sitesJoinWhereConditions = [eq(devices.site_id, sites._id)];

  if (body.join?.datas) {
    const {
      query: joinQuery,
      orderCondition: datasJoinOrderCondition,
      whereCondition: datasJoinWhereCondition,
    } = selectQuerying(lateralDatasJoin, datas, body.join.datas);

    if (datasJoinWhereCondition) datasJoinWhereConditions.push(datasJoinWhereCondition);
    if (datasJoinOrderCondition) datasJoinOrderConditions.push(...datasJoinOrderCondition);

    lateralDatasJoin = joinQuery;
  }

  if (body.join?.sites) {
    const {
      query: joinQuery,
      orderCondition: sitesJoinOrderCondition,
      whereCondition: sitesJoinWhereCondition,
    } = selectQuerying(lateralSitesJoin, sites, body.join.sites);

    if (sitesJoinWhereCondition) sitesJoinWhereConditions.push(sitesJoinWhereCondition);
    if (sitesJoinOrderCondition) sitesJoinOrderConditions.push(...sitesJoinOrderCondition);

    lateralSitesJoin = joinQuery;
  }

  const lateralSitesJoinAs = lateralSitesJoin
    .orderBy(...sitesJoinOrderConditions)
    .where(and(...sitesJoinWhereConditions))
    .as("sites");

  const lateralDatasJoinAs = lateralDatasJoin
    .orderBy(...datasJoinOrderConditions)
    .where(and(...datasJoinWhereConditions))
    .as("datas");

  const query = db
    .select({ ...deviceColumns, sites: siteColumns, datas: dataColumns })
    .from(devices)
    .leftJoinLateral(lateralSitesJoinAs, sql`true`)
    .leftJoinLateral(lateralDatasJoinAs, sql`true`)
    .$dynamic();

  const { query: selectQuery, whereCondition } = selectQuerying(query, devices, body);

  const where = [whereCondition];

  if (!is_sysadmin) {
    const siteIds = userSites?.map(({ _id }) => _id) ?? [];
    if (siteIds.length > 0) {
      where.push(or(...siteIds.map((siteId) => eq(devices.site_id, siteId))));
    } else {
      return NextResponse.json({ rows: [], rowCount: 0 }, { status: 200 });
    }
  }

  const rows = await selectQuery.where(and(...where));

  const [{ count: rowCount = 0 } = {}] = await db
    .select({ count: count() })
    .from(devices)
    .where(whereCondition);

  return NextResponse.json({ rows, rowCount }, { status: 200 });
}
