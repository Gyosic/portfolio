import { getTableColumns } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/pg";
import { EducationFormType, educationFormSchema } from "@/lib/schema/education.schema";
import { educations } from "@/lib/schema/education.table";

const educationColumns = getTableColumns(educations);

export async function POST(req: NextRequest & NextApiRequest) {
  const education: EducationFormType = await req.json();

  const properties = educationFormSchema.parse(education);

  let result;
  try {
    await db.transaction(async (tx) => {
      const rows = await tx.insert(educations).values(properties).returning(educationColumns);

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
