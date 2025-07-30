import "@/styles/tailwind.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { logo, site } from "@/config";
import { cn } from "@/lib/utils";

const pretendard = localFont({
  src: [{ path: "../public/fonts/pretendard/PretendardVariable.woff2" }],
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  icons: {
    icon: logo.light ? { type: "image/webp", url: logo.light } : undefined,
  },
};

interface RootLayoutParams extends React.PropsWithChildren {}

export default async function RootLayout({ children }: RootLayoutParams) {
  return (
    <html lang="ko">
      <body
        className={
          (cn(pretendard.className), "min-h-screen overflow-x-hidden bg-background text-foreground")
        }
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
