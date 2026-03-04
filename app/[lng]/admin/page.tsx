import { CookieArea } from "@/components/shared/CookieArea";
import { EmbeddingButton } from "@/components/shared/EmbeddingButton";
import { SignIn } from "@/components/shared/SignIn";
import { auth } from "@/lib/auth";

export default async function AdminPage() {
  const sessionContext = await auth();

  return sessionContext ? (
    <div className="flex h-full items-center justify-center p-4">
      <EmbeddingButton />
    </div>
  ) : (
    <CookieArea>
      <div className="flex h-full w-full items-center justify-center">
        <SignIn />
      </div>
    </CookieArea>
  );
}
