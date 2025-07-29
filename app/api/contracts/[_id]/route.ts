import { eq, getTableColumns } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/pg";
import { ContractFormType, ContractType, contractFormSchema } from "@/lib/schema/contract.schema";
import { contracts } from "@/lib/schema/contract.table";

type Params = { _id: string };

const contractUpdateSchema = contractFormSchema.partial();

const contractColumns = getTableColumns(contracts);

export async function PATCH(
  req: NextRequest & NextApiRequest,
  { params }: { params: Promise<Params> },
) {
  const { _id } = await params;
  if (!_id) return NextResponse.json({ message: "contract ID is required" }, { status: 400 });

  const contract: ContractFormType = await req.json();

  const properties = contractUpdateSchema.parse(contract);

  let result;

  try {
    await db.transaction(async (tx) => {
      const rows = await tx
        .update(contracts)
        .set(properties)
        .where(eq(contracts._id, _id))
        .returning(contractColumns);
      result = rows[0];
    });

    return NextResponse.json({ result });
  } catch (error) {
    const { cause: { code, detail } = {} } = error as { cause: { code?: string; detail?: string } };
    if (code === "23505") {
      // 23505: Unique violation error
      return NextResponse.json({ error: { status: 400, message: detail, code } }, { status: 400 });
    }

    console.error(error);
    return NextResponse.json({ error: { status: 500, message: error, code } }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest & NextApiRequest,
  { params }: { params: Promise<Params> },
) {
  const { _id } = await params;

  if (!_id) return NextResponse.json({ message: "contract ID is required" }, { status: 400 });

  await db.delete(contracts).where(eq(contracts._id, _id));

  return NextResponse.json({ message: "contract deleted successfully" }, { status: 200 });
}
