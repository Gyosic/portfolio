import { AppSidebar } from "@/components/shared/AppSidebar";
import { CookieArea } from "@/components/shared/CookieArea";
import { SignIn } from "@/components/shared/SignIn";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { logo, site } from "@/config";
import { auth } from "@/lib/auth";
import { Admin } from "./Admin";

export default async function AdminPage() {
  const sessionContext = await auth();

  return (
    <div>
      {!sessionContext ? (
        <CookieArea>
          <SignIn />
        </CookieArea>
      ) : (
        <SidebarProvider className="overflow-hidden bg-transparent">
          <AppSidebar variant="sidebar" site={site} logo={logo} session={sessionContext} />

          <SidebarInset className="overflow-auto bg-transparent">
            <main className="h-full w-full">
              <Admin />
            </main>
          </SidebarInset>
        </SidebarProvider>
      )}
    </div>
  );
}
