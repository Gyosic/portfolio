import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";
import { auth } from "@/lib/auth";
import FileSystem from "@/lib/fileSystem";

const STORAGE_NAME = "documents";
const ALLOWED_EXT = [".pdf", ".md", ".txt"];

function getFileSystem() {
  return new FileSystem({ storageName: STORAGE_NAME });
}

// List files
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fileSystem = getFileSystem();
  const docsDir = fileSystem.storageAbsolutePathname();

  if (!fs.existsSync(docsDir)) {
    return NextResponse.json({ files: [] });
  }

  const files = fs.readdirSync(docsDir).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return ALLOWED_EXT.includes(ext);
  });

  const fileList = files.map((name) => {
    const stat = fs.statSync(path.join(docsDir, name));
    return { name, size: stat.size, updatedAt: stat.mtime.toISOString() };
  });

  return NextResponse.json({ files: fileList });
}

// Upload files
export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fileSystem = getFileSystem();
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const uploaded: string[] = [];

  for (const file of files) {
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) continue;

    const buffer = Buffer.from(await file.arrayBuffer());
    await fileSystem.write({ filepath: file.name, content: buffer });
    uploaded.push(file.name);
  }

  return NextResponse.json({ uploaded, count: uploaded.length });
}

// Delete file
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
  }

  const fileSystem = getFileSystem();
  const safeName = path.basename(name);
  await fileSystem.unlink({ filepath: safeName });

  return NextResponse.json({ deleted: safeName });
}
