import { AppSidebar } from "@/components/shared/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { logo, site } from "@/config";
import { auth } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sessionContext = await auth();

  return !sessionContext ? (
    <main className="h-full w-full">{children}</main>
  ) : (
    <SidebarProvider className="overflow-hidden bg-transparent">
      <AppSidebar variant="sidebar" site={site} logo={logo} session={sessionContext} />

      <SidebarInset className="overflow-auto bg-transparent">
        <main className="!px-2 flex h-full w-full flex-col justify-center">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
