import { type NextRequest, NextResponse } from "next/server";
import path from "path";
import { auth } from "@/lib/auth";
import FileSystem from "@/lib/fileSystem";
import { db } from "@/lib/pg";
import { uploadFormSchema } from "@/lib/schema/upload.schema";
import { uploads } from "@/lib/schema/upload.table";

const storageName = "uploads";

// Disable Next.js body parsing for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) return NextResponse.json("인증되지 않은 요청입니다.", { status: 401 });

  try {
    const fileSystemService = new FileSystem({ storageName });
    const formData = await req.formData();
    const { file, ...data } = Object.fromEntries(formData.entries());

    const properties = await uploadFormSchema.omit({ file: true }).parseAsync(data);

    // Type guard to ensure file is a File instance
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: { status: 400, message: "File is required" } },
        { status: 400 },
      );
    }

    let filename: string | undefined;

    try {
      await db.transaction(async (tx) => {
        filename = fileSystemService.genFilename();

        const src = path.join(
          fileSystemService.destination().replace(fileSystemService.storageAbsolutePathname(), ""),
          "/",
          filename,
        );

        const buffer = await file.arrayBuffer();

        await fileSystemService.write({ filepath: src, content: Buffer.from(buffer) });

        await tx.insert(uploads).values({
          ...properties,
          file: {
            filename,
            originalname: file.name,
            lastModified: file.lastModified,
            type: file.type,
            size: file.size,
            src,
          },
        });
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

    return NextResponse.json("Success Upload Image", { status: 201 });
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
