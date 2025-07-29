import { NextRequest, NextResponse } from "next/server";
import { redirectStamp, reqStamp, resStamp } from "@/lib/log";
// import { parse } from "@/lib/url";
import packageJson from "@/package.json";

// import { site } from "./config";

const { version } = packageJson;

// const { hostname: authorizationSource } = parse(site.baseurl!);

// const addrs = (process.env.VM_NET_ADDR || "").split(",").filter(Boolean);
// const availableHosts = [...addrs, authorizationSource, "127.0.0.1", "localhost", "::1"];

export const config = {
  matcher: [
    `/((?!favicon.ico|api/rooms|api/users|_next/image|_next/static|workers/|welcome/|avatars/|signin|signup|error|tv|meet|.+|api/auth/.+).{1,})`,
    `/`,
  ],
};

const PostMiddleware = (res: NextResponse) => {
  // 버전정보 삽입
  res.headers.set("X-DMS-Version", version);

  console.debug(`${resStamp(res)}\n`);

  return res;
};

const middleware = async (req: NextRequest) => {
  // 인증 유효성 검사 전 모든 요청에 대한 작업
  /** 요청 로깅 **********************************
   * middleware는 runtime: edge로 사용되므로     *
   * nodejs API를 사용하고 있는                  *
   * `winston` 패키지를 사용할 수 없음           *
   * 서버 로그 파일을 재활용할 수 없으므로       *
   * `console.debug()`를 통해 로그를 남김         *
   * ******************************************* */
  if ("OPTIONS" !== req.method) {
    console.debug(reqStamp(req));
  }

  const { search } = req.nextUrl;

  // 공개모듈에 대해서 바로 통과
  if (["?pub=", "?health="].includes(search)) return PostMiddleware(NextResponse.next());
};

export default middleware;
