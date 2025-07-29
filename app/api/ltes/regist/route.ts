import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import FileSystem from "@/lib/fileSystem";
import { db } from "@/lib/pg";
import { lteFormServerSchema } from "@/lib/schema/lte.schema";
import { ltes } from "@/lib/schema/lte.table";

const storageName = "ltes";
const fileSystemService = new FileSystem({ storageName });

// Disable Next.js body parsing for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) return NextResponse.json("인증되지 않은 요청입니다.", { status: 401 });

  const { user: { is_sysadmin } = {} } = session;
  if (!is_sysadmin) return NextResponse.json("인증되지 않은 요청입니다.", { status: 401 });

  try {
    const formData = await req.formData();
    const { file, ...lte } = Object.fromEntries(formData.entries());

    // Type guard to ensure file is a File instance
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: { status: 400, message: "File is required" } },
        { status: 400 },
      );
    }

    const parsed = await lteFormServerSchema.omit({ file: true }).parseAsync(lte);

    let result;
    let filename: string | undefined;

    try {
      await db.transaction(async (tx) => {
        const buffer = await file.arrayBuffer();

        filename = fileSystemService.genFilename();
        await fileSystemService.write({ filepath: filename, content: Buffer.from(buffer) });

        const rows = await tx
          .insert(ltes)
          .values({
            ...parsed,
            filename,
            originalname: file.name,
            lastModified: file.lastModified,
            mimetype: file.type,
            size: file.size,
            url: `/${storageName}/${filename}`,
          })
          .returning();
        result = rows[0];
      });
    } catch (dbError) {
      // If transaction fails, clean up the uploaded file
      if (filename) {
        try {
          await fileSystemService.unlink({ filepath: filename });
        } catch (unlinkError) {
          console.error("Failed to cleanup file:", unlinkError);
        }
      }
      throw dbError;
    }

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.info(error);
    const { message, cause: { code, detail } = {} } = error as {
      message?: string;
      cause: { code?: string; detail?: string };
    };

    return NextResponse.json(
      { error: { status: 500, message: detail || message || error, code } },
      { status: !!code ? 400 : 500 },
    );
  }
}
