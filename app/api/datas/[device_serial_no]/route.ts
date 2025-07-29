import { desc, eq } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/pg";
import { datas } from "@/lib/schema/data.table";

type Params = {
  device_serial_no: string;
};
export async function GET(
  req: NextRequest & NextApiRequest,
  { params }: { params: Promise<Params> },
) {
  const { device_serial_no } = await params;

  if (!device_serial_no)
    return NextResponse.json({ message: "Device Serial Number is required" }, { status: 400 });

  try {
    const rows = await db
      .select()
      .from(datas)
      .limit(1)
      .orderBy(desc(datas.timestamp))
      .where(eq(datas.device_serial_no, device_serial_no));

    if (!rows.length)
      return NextResponse.json(
        { message: `"${device_serial_no}" 단말기의 데이터가 존재하지 않습니다.` },
        { status: 400 },
      );

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: { status: 500, message: error } }, { status: 500 });
  }
}
