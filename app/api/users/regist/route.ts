import { getTableColumns } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { generateSalt, hmacEncrypt } from "@/lib/api";
import { db } from "@/lib/pg";
import { RefineUserFormType, refineUserFormSchema } from "@/lib/schema/user.schema";
import { siteUser, users } from "@/lib/schema/user.table";

const { password: _password, salt: _salt, ...userColumns } = getTableColumns(users);

export async function POST(req: NextRequest & NextApiRequest) {
  const user: RefineUserFormType = await req.json();

  const {
    password,
    confirmPassword: _confirmPassword,
    site_id,
    ...properties
  } = refineUserFormSchema.parse(user);
  const salt = generateSalt();
  const encryptedPassword = hmacEncrypt(password, salt);

  let result;
  try {
    await db.transaction(async (tx) => {
      try {
        const rows = await tx
          .insert(users)
          .values({ ...properties, password: encryptedPassword, salt })
          .returning(userColumns);

        await tx
          .insert(siteUser)
          .values(site_id.map((siteId) => ({ site_id: siteId, user_id: rows[0]._id })))
          .onConflictDoNothing();

        result = rows[0];
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
