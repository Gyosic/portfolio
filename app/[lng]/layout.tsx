import { AppSidebar } from "@/components/shared/AppSidebar";
import { CookieArea } from "@/components/shared/CookieArea";
import { HexagonBackground } from "@/components/shared/HexagonBackground";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import Navbar from "@/components/shared/Navbar";
import { ThemeToggler } from "@/components/shared/ThemeToggler";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { logo, site } from "@/config";

import type { I18nextPageParams } from "@/lib/i18n/config";

interface DefaultLayoutProps extends React.PropsWithChildren {
  params: I18nextPageParams;
}

export default async function DefaultLayout({ children, params }: DefaultLayoutProps) {
  const { lng: lngParam } = await params;

  return (
    <CookieArea>
      <HexagonBackground className="absolute inset-0 z-0 flex items-center justify-center rounded-xl"></HexagonBackground>

      <SidebarProvider>
        <main
          suppressHydrationWarning
          className="relative flex h-dvh min-h-screen w-full items-center justify-center break-words"
        >
          <Navbar lng={lngParam} className="max-sm:hidden" />
          <AppSidebar site={site} logo={logo} className="!hidden w-0 max-sm:block" />
          <div className="absolute top-0 right-0 z-10 flex items-center gap-2 p-4">
            <SidebarTrigger className="-ml-1 hidden max-sm:block" />
            <ThemeToggler />
            <LanguageSwitcher lng={lngParam} />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </CookieArea>
  );
}
