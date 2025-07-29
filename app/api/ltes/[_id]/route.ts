import { eq } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import FileSystem from "@/lib/fileSystem";
import { db } from "@/lib/pg";
import { lteFormServerSchema } from "@/lib/schema/lte.schema";
import { ltes } from "@/lib/schema/lte.table";

const storageName = "ltes";
const fileSystemService = new FileSystem({ storageName });

type Params = { _id: string };

const lteUpdateFormSchema = lteFormServerSchema.partial();

export async function PUT(
  req: NextRequest & NextApiRequest,
  { params }: { params: Promise<Params> },
) {
  const { _id } = await params;

  if (!_id) return NextResponse.json({ message: "Lte ID is required" }, { status: 400 });

  const session = await auth();

  if (!session) return NextResponse.json("인증되지 않은 요청입니다.", { status: 401 });

  const { user: { is_sysadmin } = {} } = session;
  if (!is_sysadmin) return NextResponse.json("인증되지 않은 요청입니다.", { status: 401 });

  const formData = await req.formData();
  const { file, ...lte } = Object.fromEntries(formData.entries());

  const parsed = lteUpdateFormSchema.partial().parse(lte);

  let result;
  let filename;
  try {
    await db.transaction(async (tx) => {
      if (file instanceof File) {
        const [selectedLte] = await tx.select().from(ltes).where(eq(ltes.filename, _id));
        await fileSystemService.unlink({ filepath: selectedLte.filename });

        const buffer = await file.arrayBuffer();
        filename = fileSystemService.genFilename();
        await fileSystemService.write({ filepath: filename, content: Buffer.from(buffer) });

        const rows = await tx
          .update(ltes)
          .set({
            ...parsed,
            filename,
            originalname: file.name,
            lastModified: file.lastModified,
            mimetype: file.type,
            size: file.size,
            url: `/${storageName}/${filename}`,
          })
          .where(eq(ltes.filename, _id))
          .returning();
        result = rows[0];
      } else {
        const rows = await tx
          .update(ltes)
          .set({ ...parsed })
          .where(eq(ltes.filename, _id))
          .returning();
        result = rows[0];
      }
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

  if (!_id) return NextResponse.json({ message: "Lte ID is required" }, { status: 400 });

  const session = await auth();

  if (!session) return NextResponse.json("인증되지 않은 요청입니다.", { status: 401 });

  const { user: { is_sysadmin } = {} } = session;
  if (!is_sysadmin) return NextResponse.json("인증되지 않은 요청입니다.", { status: 401 });

  try {
    await db.transaction(async (tx) => {
      const rows = await tx.delete(ltes).where(eq(ltes.filename, _id)).returning();

      const [{ filename }] = rows;

      await fileSystemService.unlink({ filepath: filename });
    });

    return NextResponse.json("Success Delete", { status: 200 });
  } catch (error) {
    const { cause: { code, detail } = {} } = error as { cause: { code?: string; detail?: string } };

    return NextResponse.json(
      { error: { status: 500, message: detail || error, code } },
      { status: !!code ? 400 : 500 },
    );
  }
}
