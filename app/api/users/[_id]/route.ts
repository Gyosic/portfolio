import { and, eq, getTableColumns, ne, or } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/pg";
import { UserFormType, userFormSchema } from "@/lib/schema/user.schema";
import { siteUser, users } from "@/lib/schema/user.table";

type Params = { _id: string };
type UserUpdateSchema = Omit<UserFormType, "password">;
const userUpdateSchema = userFormSchema.omit({ password: true }).partial();

const { password: _password, salt: _salt, ...userColumns } = getTableColumns(users);

export async function PUT(
  req: NextRequest & NextApiRequest,
  { params }: { params: Promise<Params> },
) {
  const { _id } = await params;

  if (!_id) return NextResponse.json({ message: "User ID is required" }, { status: 400 });

  const user: UserUpdateSchema = await req.json();

  const { site_id, ...properties } = userUpdateSchema.parse(user);

  let result;

  try {
    await db.transaction(async (tx) => {
      try {
        const rows = await tx
          .update(users)
          .set({ ...properties })
          .where(eq(users._id, _id))
          .returning(userColumns);

        if (site_id) {
          await tx
            .delete(siteUser)
            .where(
              and(
                or(...site_id.map((siteId: string) => ne(siteUser.site_id, siteId))),
                eq(siteUser.user_id, _id),
              ),
            );

          await tx
            .insert(siteUser)
            .values(site_id.map((siteId: string) => ({ site_id: siteId, user_id: _id })))
            .onConflictDoNothing();
        }

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

    console.error(error);
    return NextResponse.json({ error: { status: 500, message: error, code } }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest & NextApiRequest,
  { params }: { params: Promise<Params> },
) {
  const { _id } = await params;

  if (!_id) return NextResponse.json({ message: "User ID is required" }, { status: 400 });

  await db.delete(users).where(eq(users._id, _id));

  return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
}
