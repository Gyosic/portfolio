import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth/lib";
import { auth } from "@/lib/auth";
import authConfig from "@/lib/auth/config";
import { redirectStamp, reqStamp, resStamp } from "@/lib/log";
import { parse } from "@/lib/url";
import packageJson from "@/package.json";
import { site } from "./config";

const { version } = packageJson;

const { hostname: authorizationSource } = parse(site.baseurl!);

const addrs = (process.env.VM_NET_ADDR || "").split(",").filter(Boolean);
const availableHosts = [...addrs, authorizationSource, "127.0.0.1", "localhost", "::1"];

export const config = {
  matcher: [
    `/((?!favicon.ico|api/rooms|api/users|_next/image|_next/static|workers/|welcome/|avatars/|signin|signup|error|tv|meet|.+|api/auth/.+).{1,})`,
    `/`,
  ],
};

const getSigninPathname = (req: NextAuthRequest) => {
  const { origin, pathname: callbackUrl } = req.nextUrl;

  return `${origin}${authConfig.pages.signIn}?${new URLSearchParams({ callbackUrl })}`;
};

const redirect = (url: URL, reason: string) => {
  console.debug(`${redirectStamp(url, reason)}\n`);

  return NextResponse.redirect(url);
};

const redirectToSignin = (req: NextAuthRequest) => {
  const url = new URL(getSigninPathname(req));

  return redirect(url, `Unauthorized`);
};

const PostMiddleware = (res: NextResponse) => {
  // 버전정보 삽입
  res.headers.set("X-PORTFOLIO-Version", version);

  console.debug(`${resStamp(res)}\n`);

  return res;
};

const middleware = auth(async (req: NextAuthRequest) => {
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

  const { pathname, search } = req.nextUrl;

  const isApiRequest = pathname.startsWith("/api");

  // 세션정보가 담겨있다면 바로 통과
  if (req.auth) return PostMiddleware(NextResponse.next());

  // 공개모듈에 대해서 바로 통과
  if (["?pub=", "?health="].includes(search)) return PostMiddleware(NextResponse.next());

  // 예외적으로, 로그인 하지 않고 외부에서 Ajax 요청으로
  // Restful API 만을 활용하려는 경우,
  // 쿠키를 별도로 사용하기에는 너무 복잡하므로
  // `Header`의 `Authorization`을 활용하여 `Bearer` 체크를 진행함.
  const credential = req.headers.get("Authorization") ?? "";

  // Authorization 헤더가 없다면 확인할 필요없이 세션이 비어있음.
  if (!credential) {
    if (!isApiRequest) return redirectToSignin(req);

    // API 요청일 경우, 등록된 게이트웨이를 확인
    // 등록된 게이트웨이의 경우 인증을 거치지 않음
    const ip = (req.headers.get("x-forwarded-for")?.split(",") ?? []).pop();

    if (ip) {
      // 로컬 요청이거나 등록된 IP의 경우 ByPass
      if (availableHosts.includes(ip)) return PostMiddleware(NextResponse.next());

      //   // POSTFUL 적용
      //   const headers = new Headers({ "Content-Type": "application/json" });
      //   const gatewayRes = await fetch(`${baseurl}/api`, {
      //     method: "POST",
      //     headers,
      //     body: JSON.stringify({ service: "gateway.count", where: { ip } }),
      //     cache: "no-store",
      //   });

      // 등록된 게이트웨이라면 통과
      // const { count: gatewayCount } = await gatewayRes.json();
      // if (gatewayCount) return PostMiddleware(NextResponse.next());

      //   // 등록되지 않은 기기
      console.warn(`"${ip}" 주소는 등록되어 있지 않습니다.: ${pathname}`);

      return redirectToSignin(req);
    } else {
      // 출처를 알 수 없는 기기
      return redirectToSignin(req);
    }
  }
});

export default middleware;
