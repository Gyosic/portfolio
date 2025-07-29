import { AppSidebar } from "@/components/shared/AppSidebar";
import Header from "@/components/shared/Header";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { logo, site } from "@/config";

interface DefaultLayoutProps extends React.PropsWithChildren {}

export default async function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <SidebarProvider className="h-screen max-h-screen min-w-screen overflow-hidden">
      <AppSidebar variant="sidebar" site={site} logo={logo} />

      <SidebarInset className="overflow-auto">
        <Header />
        <main className="px-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
