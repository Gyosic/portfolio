import { CookieArea } from "@/components/shared/CookieArea";
import { HexagonBackground } from "@/components/shared/HexagonBackground";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import Navbar from "@/components/shared/Navbar";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";

import type { I18nextPageParams } from "@/lib/i18n/config";

interface DefaultLayoutProps extends React.PropsWithChildren {
  params: I18nextPageParams;
}

export default async function DefaultLayout({ children, params }: DefaultLayoutProps) {
  const { lng: lngParam } = await params;

  return (
    <CookieArea>
      <main className="relative flex h-dvh min-h-screen items-center justify-center px-40 pt-14 pb-4 max-sm:pt-20 max-md:p-4">
        <HexagonBackground className="absolute inset-0 z-0 flex items-center justify-center rounded-xl" />

        <Navbar lng={lngParam} />
        <div className="absolute top-0 right-0 z-10 flex items-center gap-2 p-4">
          <ThemeSwitcher lng={lngParam} />
          <LanguageSwitcher lng={lngParam} />
        </div>
        <div className="z-1 w-full px-4">{children}</div>
      </main>
    </CookieArea>
  );
}
