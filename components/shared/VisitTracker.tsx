"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function VisitTracker() {
  const pathname = usePathname();
  const session = useSession();

  useEffect(() => {
    // 관리자 로그인 했을 경우 log 남기지 않음
    if (session.status === "authenticated") return;

    // 페이지 로드 시 방문 기록 수집
    const trackVisit = async () => {
      try {
        const visitData = {
          user_agent: navigator.userAgent,
          referer: document.referrer || "direct",
          pathname,
        };

        // sendBeacon을 사용하여 페이지 이동에 영향 없이 전송
        if (navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify(visitData)], {
            type: "application/json",
          });
          navigator.sendBeacon("/api/visits", blob);
        } else {
          // fallback: fetch 사용
          fetch("/api/visits", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(visitData),
          }).catch((err) => {
            console.error("[VISIT]: Failed to send visit data:", err);
          });
        }
      } catch (err) {
        console.error("[VISIT]: Error tracking visit:", err);
      }
    };

    trackVisit();
  }, [pathname, session]);

  // 이 컴포넌트는 UI를 렌더링하지 않습니다
  return null;
}
