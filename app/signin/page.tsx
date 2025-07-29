// import Image from "next/image";
import { redirect } from "next/navigation";
import { CookieArea } from "@/components/shared/CookieArea";

import { SigninForm } from "@/components/shared/SigninForm";

// import { api } from "@/config";
import { auth } from "@/lib/auth";
import type { NextAuthPageSearchParams } from "@/lib/auth/config";
import * as session from "@/lib/auth/session";

// import LoginBg from "@/public/signin/bg.webp";

interface LoginPageParams {
  searchParams: NextAuthPageSearchParams;
}

export default async function LoginPage({ searchParams }: LoginPageParams) {
  const { callbackUrl } = await searchParams;

  const sessionContext = await auth();

  if (session.id(sessionContext)) {
    return redirect(`${callbackUrl ? callbackUrl : "/"}`);
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      {/* <Image
        src={LoginBg}
        height="0"
        width="0"
        alt="login background"
        className="absolute size-full"
      />*/}
      <CookieArea>
        <SigninForm callbackUrl={callbackUrl} />
      </CookieArea>
    </div>
  );
}
