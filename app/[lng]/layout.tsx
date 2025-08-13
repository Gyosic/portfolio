import { AppNavbar } from "@/components/shared/AppNavbar";

import { logo, site } from "@/config";
import type { I18nextPageParams } from "@/lib/i18n/config";

interface DefaultLayoutProps extends React.PropsWithChildren {
  params: I18nextPageParams;
}

export default async function DefaultLayout({ children, params }: DefaultLayoutProps) {
  const { lng: lngParam } = await params;

  return (
    <main>
      <AppNavbar lng={lngParam} site={site} logo={logo} />

      <div className="px-4">{children}</div>
    </main>
  );
}
