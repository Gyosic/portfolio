import { eq, getTableColumns } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { db } from "@/lib/pg";
import { projectFormSchema } from "@/lib/schema/project.schema";
import { projects } from "@/lib/schema/project.table";

type Params = { _id: string };

const projectColumns = getTableColumns(projects);

const projectUpdateFormSchema = projectFormSchema.partial();
type ProjectUpdateFormType = z.infer<typeof projectUpdateFormSchema>;

export async function PUT(
  req: NextRequest & NextApiRequest,
  { params }: { params: Promise<Params> },
) {
  const { _id } = await params;

  if (!_id) return NextResponse.json({ message: "Device serial_no is required" }, { status: 400 });

  const project: ProjectUpdateFormType = await req.json();

  const properties = projectUpdateFormSchema.parse(project);

  let result;
  try {
    await db.transaction(async (tx) => {
      const rows = await tx
        .update(projects)
        .set(properties)
        .where(eq(projects._id, _id))
        .returning(projectColumns);

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

  if (!_id) return NextResponse.json({ message: "Project '_id' is required" }, { status: 400 });

  await db.delete(projects).where(eq(projects._id, _id));

  return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
}
