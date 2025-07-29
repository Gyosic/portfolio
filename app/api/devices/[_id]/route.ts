import { eq, getTableColumns } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { db } from "@/lib/pg";
import { deviceFormServerSchema } from "@/lib/schema/device.schema";
import { devices } from "@/lib/schema/device.table";

type Params = { _id: string };

const deviceColumns = getTableColumns(devices);

const deviceUpdateFormSchema = deviceFormServerSchema.partial();
type DeviceUpdateFormType = z.infer<typeof deviceUpdateFormSchema>;

export async function PUT(
  req: NextRequest & NextApiRequest,
  { params }: { params: Promise<Params> },
) {
  const { _id } = await params;

  if (!_id) return NextResponse.json({ message: "Device serial_no is required" }, { status: 400 });

  const device: DeviceUpdateFormType = await req.json();

  const {
    site_id = null,
    contract_id = null,
    ...properties
  } = deviceUpdateFormSchema.partial().parse(device);

  let result;
  try {
    await db.transaction(async (tx) => {
      const rows = await tx
        .update(devices)
        .set({ site_id, contract_id, ...properties })
        .where(eq(devices.serial_no, _id))
        .returning(deviceColumns);

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

  if (!_id) return NextResponse.json({ message: "Device serial_no is required" }, { status: 400 });

  await db.delete(devices).where(eq(devices.serial_no, _id));

  return NextResponse.json({ message: "Site deleted successfully" }, { status: 200 });
}
