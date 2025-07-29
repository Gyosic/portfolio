import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/shared/AppSidebar";
import Header from "@/components/shared/Header";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { logo, site } from "@/config";
import { auth } from "@/lib/auth";
import authConfig from "@/lib/auth/config";
import * as session from "@/lib/auth/session";

interface DefaultLayoutProps extends React.PropsWithChildren {}

export default async function DefaultLayout({ children }: DefaultLayoutProps) {
  const sessionContext = await auth();

  if (!session.id(sessionContext)) return redirect(authConfig.pages.signIn);

  return (
    <SidebarProvider className="h-screen max-h-screen min-w-screen overflow-hidden">
      <AppSidebar variant="sidebar" site={site} logo={logo} session={sessionContext} />

      <SidebarInset className="overflow-auto">
        <Header />
        <main className="px-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
