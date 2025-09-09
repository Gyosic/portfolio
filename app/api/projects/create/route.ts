import { getTableColumns } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { auth } from "@/lib/auth";
import FileSystem from "@/lib/fileSystem";
import { parseFormData } from "@/lib/formdata";
import { db } from "@/lib/pg";
import { projectFormSchema } from "@/lib/schema/project.schema";
import { projects } from "@/lib/schema/project.table";

const storageName = "projects";
const projectColumns = getTableColumns(projects);

export async function POST(req: NextRequest & NextApiRequest) {
  const session = await auth();

  if (!session) return NextResponse.json("인증되지 않은 요청입니다.", { status: 401 });

  const fileSystemService = new FileSystem({ storageName });
  const formData = await req.formData();
  const project = parseFormData(formData);

  const properties = await projectFormSchema.parseAsync(project);

  let result;
  let filename: string | undefined;

  try {
    await db.transaction(async (tx) => {
      if (properties.readme && properties.readme instanceof File) {
        filename = fileSystemService.genFilename();

        const src = path.join(
          fileSystemService.destination().replace(fileSystemService.storageAbsolutePathname(), ""),
          "/",
          filename,
        );

        const buffer = await properties.readme.arrayBuffer();

        await fileSystemService.write({ filepath: src, content: Buffer.from(buffer) });

        Object.assign(properties, {
          readme: {
            filename,
            originalname: properties.readme.name,
            lastModified: properties.readme.lastModified,
            type: properties.readme.type,
            size: properties.readme.size,
            src,
          },
        });
      }

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
