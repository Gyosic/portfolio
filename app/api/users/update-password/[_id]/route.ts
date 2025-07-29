import { eq } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { hmacEncrypt } from "@/lib/api";
import { db } from "@/lib/pg";
import { UserPasswordFormType, userPasswordSchema } from "@/lib/schema/user.schema";
import { users } from "@/lib/schema/user.table";

type Params = { _id: string };

export async function PUT(
  req: NextRequest & NextApiRequest,
  { params }: { params: Promise<Params> },
) {
  const { _id } = await params;

  if (!_id) return NextResponse.json({ message: "User ID is required" }, { status: 400 });

  const user: UserPasswordFormType = await req.json();

  const { password } = userPasswordSchema.parse(user);

  const [{ salt } = {}] = await db
    .select({ salt: users.salt })
    .from(users)
    .where(eq(users._id, _id));

  if (!salt)
    return NextResponse.json(
      { error: { status: 400, message: "유효하지 않은 사용자" } },
      { status: 400 },
    );

  const encryptedPassword = hmacEncrypt(password, salt);

  let result;

  try {
    await db.transaction(async (tx) => {
      try {
        await tx.update(users).set({ password: encryptedPassword }).where(eq(users._id, _id));

        result = "비밀번호 변경완료";
      } catch (err) {
        result = err;
      }
    });

    return NextResponse.json({ result });
  } catch (error) {
    const { cause: { code, detail } = {} } = error as { cause: { code?: string; detail?: string } };
    if (code === "23505") {
      // 23505: Unique violation error
      return NextResponse.json({ error: { status: 400, message: detail, code } }, { status: 400 });
    }

    return NextResponse.json({ error: { status: 500, message: error, code } }, { status: 500 });
  }
}
