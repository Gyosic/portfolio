import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/pg";
import { deviceFormServerSchema } from "@/lib/schema/device.schema";
import { devices } from "@/lib/schema/device.table";

const batchRequestSchema = z.object({
  devices: z.array(deviceFormServerSchema),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) return NextResponse.json("인증되지 않은 요청입니다.", { status: 401 });

    const body = await req.json();
    const { devices: deviceList } = batchRequestSchema.parse(body);

    if (deviceList.length === 0) {
      return NextResponse.json(
        { error: { message: "등록할 단말기가 없습니다." } },
        { status: 400 },
      );
    }

    // 중복된 시리얼 번호 체크
    const serialNumbers = deviceList.map((device) => device.serial_no);
    const duplicateSerials = serialNumbers.filter(
      (serial, index) => serialNumbers.indexOf(serial) !== index,
    );

    if (duplicateSerials.length > 0) {
      return NextResponse.json(
        {
          error: {
            message: `중복된 시리얼 번호가 있습니다: ${duplicateSerials.join(", ")}`,
          },
        },
        { status: 400 },
      );
    }

    // 일괄 삽입
    const insertData = deviceList.map((device) => device);
    db.transaction(async (tx) => {
      await tx.insert(devices).values(insertData).returning();
    });

    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.error("Batch device creation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            message: "입력 데이터 형식이 올바르지 않습니다.",
            details: error.cause,
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: {
          message: "단말기 일괄 등록 중 오류가 발생했습니다.",
        },
      },
      { status: 500 },
    );
  }
}
