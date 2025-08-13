import { AppNavbar } from "@/components/shared/AppNavbar";
import Navbar from "@/components/shared/Navbar";

import { logo, site } from "@/config";
import type { I18nextPageParams } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

interface DefaultLayoutProps extends React.PropsWithChildren {
  params: I18nextPageParams;
}

export default async function DefaultLayout({ children, params }: DefaultLayoutProps) {
  const { lng: lngParam } = await params;

  return (
    <main
      className={cn(
        "relative flex h-dvh min-h-screen items-center justify-between break-words bg-[radial-gradient(#2f7df4_1px,transparent_1px)] bg-transparent px-40 pt-14 pb-4 [background-size:16px_16px] max-sm:pt-20 max-md:p-4",
        { "bg-white": "#E6E7EB" },
      )}
    >
      {/* <AppNavbar lng={lngParam} site={site} logo={logo} /> */}
      <Navbar lng={lngParam} />
      <div className="px-4">{children}</div>
    </main>
  );
}
