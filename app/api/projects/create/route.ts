import { getTableColumns } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/pg";
import { ProjectFormType, projectFormSchema } from "@/lib/schema/project.schema";
import { projects } from "@/lib/schema/project.table";

const projectColumns = getTableColumns(projects);

export async function POST(req: NextRequest & NextApiRequest) {
  const session = await auth();

  if (!session) return NextResponse.json("인증되지 않은 요청입니다.", { status: 401 });

  const project: ProjectFormType = await req.json();

  const properties = projectFormSchema.parse(project);

  let result;
  try {
    await db.transaction(async (tx) => {
      const rows = await tx.insert(projects).values(properties).returning(projectColumns);

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
