import { eq, getTableColumns } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { db } from "@/lib/pg";
import { educationFormSchema } from "@/lib/schema/education.schema";
import { educations } from "@/lib/schema/education.table";

type Params = { _id: string };

const educationColumns = getTableColumns(educations);

const educationUpdateFormSchema = educationFormSchema.partial();
type DeviceUpdateFormType = z.infer<typeof educationUpdateFormSchema>;

export async function PUT(
  req: NextRequest & NextApiRequest,
  { params }: { params: Promise<Params> },
) {
  const { _id } = await params;

  if (!_id) return NextResponse.json({ message: "Device serial_no is required" }, { status: 400 });

  const education: DeviceUpdateFormType = await req.json();

  const properties = educationUpdateFormSchema.parse(education);

  let result;
  try {
    await db.transaction(async (tx) => {
      const rows = await tx
        .update(educations)
        .set(properties)
        .where(eq(educations._id, _id))
        .returning(educationColumns);

      result = rows[0];
    });

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    const { cause: { code, detail } = {} } = error as { cause: { code?: string; detail?: string } };

    return NextResponse.json(
      { error: { status: 500, message: detail || error, code } },
      { status: !!code ? 400 : 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest & NextApiRequest,
  { params }: { params: Promise<Params> },
) {
  const { _id } = await params;

  if (!_id) return NextResponse.json({ message: "Education '_id' is required" }, { status: 400 });

  await db.delete(educations).where(eq(educations._id, _id));

  return NextResponse.json({ message: "Education deleted successfully" }, { status: 200 });
}
