import { match } from "@formatjs/intl-localematcher";

import Negotiator from "negotiator";
import { NextResponse } from "next/server";

import type { NextAuthRequest } from "next-auth/lib";
import { auth } from "@/lib/auth";
import type { Language } from "@/lib/i18n/config";
import { cookieName, fallbackLng, languages } from "@/lib/i18n/config";
import { redirectStamp, reqStamp, resStamp } from "@/lib/log";
// import { parse } from "@/lib/url";
import packageJson from "@/package.json";

const { version } = packageJson;

// const { hostname: authorizationSource } = parse(site.baseurl!);

// const addrs = (process.env.VM_NET_ADDR || "").split(",").filter(Boolean);
// const availableHosts = [...addrs, authorizationSource, "127.0.0.1", "localhost", "::1"];

export const config = {
  matcher: [
    `/((?!favicon.ico|api/rooms|api/users|_next/image|_next/static|workers/|welcome/|avatars/|[^/]+/signin|[^/]+/signup|[^/]+/error|[^/]+/tv|[^/]+/meet|.*\\.(?:jpg|jpeg|png|gif|svg|webp|ico)|(?:[^/]+/)?languages/.+|api/auth/.+).{1,})`,
    `/`,
  ],
};

const redirect = (url: URL, reason: string) => {
  console.debug(`${redirectStamp(url, reason)}\n`);
  return NextResponse.redirect(url);
};

const getLocale = (req: NextAuthRequest): Language => {
  const acceptLanguages = new Negotiator({
    headers: {
      "accept-language":
        req.cookies.get(cookieName)?.value || (req.headers.get("accept-language") as string),
    },
  }).languages();

  try {
    return match(acceptLanguages, languages, fallbackLng) as Language;
  } catch (err) {
    /**
     * SSR 내에서 `fetch`를 사용할 경우,
     * 브라우저에서 사용중인 언어정보와 동기화하여 함수를 호출할 수 있는 방법을 제공해야함.
     * `accept-language`가 브라우저와 다르거나, 아니면 정보가 비어있어서 오류가 발생할 수 있음.
     */
    if (err instanceof RangeError) return match([fallbackLng], languages, fallbackLng) as Language;
    throw err;
  }
};

const PostMiddleware = (res: NextResponse) => {
  // 버전정보 삽입
  res.headers.set("X-G-Version", version);

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

  // 사용자 정보를 기준으로 언어 선택
  const { origin, pathname, search } = req.nextUrl;
  const hasLocale = languages.some(
    (language) => pathname.startsWith(`/${language}/`) || pathname === `/${language}`,
  );

  const language: Language = getLocale(req);

  const isApiRequest = pathname.startsWith("/api");

  // API를 제외한 나머지 페이지에 대하여 다국어 적용
  if (!isApiRequest && !hasLocale)
    return redirect(new URL(`${origin}/${language}${pathname}${search}`), "Unlocale");

  return PostMiddleware(NextResponse.next());

  // // 공개모듈에 대해서 바로 통과
  // if (["?pub=", "?health="].includes(search)) return PostMiddleware(NextResponse.next());

  // // 예외적으로, 로그인 하지 않고 외부에서 Ajax 요청으로
  // // Restful API 만을 활용하려는 경우,
  // // 쿠키를 별도로 사용하기에는 너무 복잡하므로
  // // `Header`의 `Authorization`을 활용하여 `Bearer` 체크를 진행함.
  // const credential = req.headers.get("Authorization") ?? "";

  // // Authorization 헤더가 없다면 확인할 필요없이 세션이 비어있음.
  // if (!credential) {
  //   if (!isApiRequest) return redirectToSignin(req, language);

  //   // API 요청일 경우, 등록된 게이트웨이를 확인
  //   // 등록된 게이트웨이의 경우 인증을 거치지 않음
  //   const ip = (req.headers.get("x-forwarded-for")?.split(",") ?? []).pop();

  //   if (ip) {
  //     // 로컬 요청이거나 등록된 IP의 경우 ByPass
  //     if (availableHosts.includes(ip)) return PostMiddleware(NextResponse.next());

  //     //   // POSTFUL 적용
  //     //   const headers = new Headers({ "Content-Type": "application/json" });
  //     //   const gatewayRes = await fetch(`${baseurl}/api`, {
  //     //     method: "POST",
  //     //     headers,
  //     //     body: JSON.stringify({ service: "gateway.count", where: { ip } }),
  //     //     cache: "no-store",
  //     //   });

  //     // 등록된 게이트웨이라면 통과
  //     // const { count: gatewayCount } = await gatewayRes.json();
  //     // if (gatewayCount) return PostMiddleware(NextResponse.next());

  //     //   // 등록되지 않은 기기
  //     console.warn(`"${ip}" 주소는 등록되어 있지 않습니다.: ${pathname}`);

  //     return redirectToSignin(req, language);
  //   } else {
  //     // 출처를 알 수 없는 기기
  //     return redirectToSignin(req, language);
  //   }
  // }
});

export default middleware;
