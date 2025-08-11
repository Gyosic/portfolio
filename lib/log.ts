import type { NextRequest, NextResponse } from "next/server";

import { date as format } from "./format";

export const reqStamp = (req: NextRequest): string =>
  `🠖 ${format(Date.now(), { type: "log" })} (${req.method}) ${req.url}`;

export const resStamp = (res: NextResponse): string =>
  `🠔 ${format(Date.now(), { type: "log" })} ${res.status} ${res.type}`;

export const redirectStamp = (url: URL, reason: string): string =>
  `  ⮎ ${reason} ${url.pathname}${url.search}`;
