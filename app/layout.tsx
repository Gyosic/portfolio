import "@/styles/tailwind.css";

import { dir } from "i18next";
import type { Metadata } from "next";
import { Poppins, Rubik } from "next/font/google";
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

import { logo, site } from "@/config";
import type { I18nextPageParams } from "@/lib/i18n/config";
import { languages } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const pretendard = localFont({
  src: [{ path: "../public/fonts/pretendard/PretendardVariable.woff2" }],
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-poppins",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  icons: {
    icon: { type: "image/webp", url: logo.light! },
  },
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

interface RootLayoutParams extends React.PropsWithChildren {
  params: I18nextPageParams;
}

export default async function RootLayout({ children, params }: RootLayoutParams) {
  const { lng = "ko" } = await params;

  return (
    <html lang={lng} dir={dir(lng)}>
      <body className={cn(pretendard.className, poppins.variable, rubik.variable)}>
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
