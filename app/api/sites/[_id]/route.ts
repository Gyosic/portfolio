import { eq, getTableColumns } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/pg";
import { SiteFormType, siteFormSchema } from "@/lib/schema/site.schema";
import { sites } from "@/lib/schema/site.table";

type Params = { _id: string };

const siteUpdateSchema = siteFormSchema.partial();

const siteColumns = getTableColumns(sites);

export async function PUT(
  req: NextRequest & NextApiRequest,
  { params }: { params: Promise<Params> },
) {
  const { _id } = await params;

  if (!_id) return NextResponse.json({ message: "Site ID is required" }, { status: 400 });

  const site: SiteFormType = await req.json();

  const properties = siteUpdateSchema.parse(site);

  let result;

  try {
    await db.transaction(async (tx) => {
      try {
        const rows = await tx
          .update(sites)
          .set(properties)
          .where(eq(sites._id, _id))
          .returning(siteColumns);

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

    console.error(error);
    return NextResponse.json({ error: { status: 500, message: error, code } }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest & NextApiRequest,
  { params }: { params: Promise<Params> },
) {
  const { _id } = await params;

  if (!_id) return NextResponse.json({ message: "Site ID is required" }, { status: 400 });

  await db.delete(sites).where(eq(sites._id, _id));

  return NextResponse.json({ message: "Site deleted successfully" }, { status: 200 });
}
