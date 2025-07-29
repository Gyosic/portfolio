import { getTableColumns } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/pg";
import { SiteFormType, siteFormSchema } from "@/lib/schema/site.schema";
import { sites } from "@/lib/schema/site.table";

const siteColumns = getTableColumns(sites);

export async function POST(req: NextRequest & NextApiRequest) {
  const site: SiteFormType = await req.json();

  const properties = siteFormSchema.parse(site);

  let result;
  try {
    await db.transaction(async (tx) => {
      try {
        const rows = await tx.insert(sites).values(properties).returning(siteColumns);

        result = rows[0];
      } catch (err) {
        result = err;
      }
    });

    return NextResponse.json({ result });
  } catch (error) {
    const { cause: { code, detail } = {} } = error as { cause: { code?: string; detail?: string } };
    if (code === "23505") {
      // 23505: Unique violation error
      return NextResponse.json({ error: { status: 400, message: detail, code } }, { status: 400 });
    }

    return NextResponse.json({ error: { status: 500, message: error, code } }, { status: 500 });
  }
}
