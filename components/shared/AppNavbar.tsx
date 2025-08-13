import { Navbar02 } from "@/components/ui/shadcn-io/navbar-02";
import type { LogoType, SiteType } from "@/config";
import type { Language } from "@/lib/i18n/config";

interface AppNavbarProps {
  lng?: Language;
  logo: LogoType;
  site: SiteType;
}
export function AppNavbar({ logo }: AppNavbarProps) {
  return (
    <div className="relative w-full">
      <Navbar02 logo={logo} />
    </div>
  );
}
