import { getTableColumns } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/pg";
import { DeviceFormType, deviceFormServerSchema } from "@/lib/schema/device.schema";
import { devices } from "@/lib/schema/device.table";

const deviceColumns = getTableColumns(devices);

export async function POST(req: NextRequest & NextApiRequest) {
  const device: DeviceFormType = await req.json();

  const properties = deviceFormServerSchema.parse(device);

  let result;
  try {
    await db.transaction(async (tx) => {
      const rows = await tx.insert(devices).values(properties).returning(deviceColumns);

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
