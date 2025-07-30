import { AppSidebar } from "@/components/shared/AppSidebar";
import Header from "@/components/shared/Header";
import { Boxes } from "@/components/ui/shadcn-io/background-boxes";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { logo, site } from "@/config";
import { cn } from "@/lib/utils";

interface DefaultLayoutProps extends React.PropsWithChildren {}

export default async function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <SidebarProvider className="h-screen max-h-screen min-w-screen overflow-hidden">
      <AppSidebar variant="sidebar" site={site} logo={logo} />

      <SidebarInset className="overflow-auto">
        <Header />
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-slate-900">
          <div className="pointer-events-none absolute inset-0 z-1 h-full w-full bg-slate-900 [mask-image:radial-gradient(transparent,white)]" />
          <Boxes />
          <main className="z-2 px-4">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
