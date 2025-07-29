import { ColumnDataType, count, eq, getTableColumns, Operators } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { db, selectQuerying } from "@/lib/pg";
import { SiteType } from "@/lib/schema/site.schema";
import { sites } from "@/lib/schema/site.table";
import { UserType } from "@/lib/schema/user.schema";
import { siteUser, users } from "@/lib/schema/user.table";

const { password: _password, salt: _salt, ...userColumns } = getTableColumns(users);
const siteColumns = getTableColumns(sites);

type FilterType = {
  field: keyof typeof userColumns;
  operator: keyof Operators;
  value: ColumnDataType;
  or?: boolean;
};
type BodyType = {
  where?: FilterType[];
  sort?: { id: keyof typeof userColumns; desc: boolean }[];
  pagination?: { pageIndex: number; pageSize: number };
};

export async function POST(req: NextRequest & NextApiRequest) {
  let body: BodyType = {};
  try {
    body = await req.json();
  } catch {}

  const query = db
    .select({ ...userColumns, site: siteColumns })
    .from(users)
    .leftJoin(siteUser, eq(users._id, siteUser.user_id))
    .leftJoin(sites, eq(siteUser.site_id, sites._id))
    .$dynamic();

  const { query: selectQuery, whereCondition } = selectQuerying(query, sites, body);

  const rows = await selectQuery;
  const [{ count: rowCount = 0 } = {}] = await db
    .select({ count: count() })
    .from(users)
    .where(whereCondition);

  const grouped = Object.values(
    rows.reduce(
      (acc, { site, ...row }) => {
        const userId = row._id;
        if (!acc?.[userId]) Object.assign(acc, { [userId]: { ...row, sites: [] } });

        if (site && acc[userId]) acc[userId].sites.push(site as SiteType);

        return acc;
      },
      {} as Record<string, Omit<UserType, "password" | "salt"> & { sites: SiteType[] }>,
    ),
  );

  return NextResponse.json({ rows: grouped, rowCount }, { status: 200 });
}
