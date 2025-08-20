import { CookieArea } from "@/components/shared/CookieArea";
import { SignIn } from "@/components/shared/SignIn";
import { auth } from "@/lib/auth";
export default async function AdminPage() {
  const sessionContext = await auth();

  return sessionContext ? (
    <></>
  ) : (
    <CookieArea>
      <div className="flex h-full w-full items-center justify-center">
        <SignIn />
      </div>
    </CookieArea>
  );
}
