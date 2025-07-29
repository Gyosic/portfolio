import { getTableColumns } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/pg";
import { ContractFormType, contractFormSchema } from "@/lib/schema/contract.schema";
import { contracts } from "@/lib/schema/contract.table";

const contractsColumns = getTableColumns(contracts);

export async function POST(req: NextRequest & NextApiRequest) {
  const contract: ContractFormType = await req.json();

  const properties = contractFormSchema.parse(contract);
  try {
    let result;

    if (!properties || Object.keys(properties).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "입력 데이터가 없습니다.",
          code: "NO_DATA",
        },
        { status: 400 },
      );
    }

    await db.transaction(async (tx) => {
      const rows = await tx.insert(contracts).values(properties).returning(contractsColumns);
      console.log("Successfully inserted rows:", rows);

      if (!rows || rows.length === 0) {
        throw new Error("Insert operation returned no data");
      }

      result = rows[0];
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "계약이 성공적으로 생성되었습니다.",
    });
  } catch (error) {
    console.error("Database transaction failed:", error);

    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

    return NextResponse.json(
      {
        success: false,
        error: "데이터베이스 처리 중 오류가 발생했습니다.",
        code: "DATABASE_ERROR",
        ...(process.env.NODE_ENV === "development" && { details: errorMessage }),
      },
      { status: 500 },
    );
  }
}
