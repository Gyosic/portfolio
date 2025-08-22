"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { NavLinks } from "@/components/shared/NavLinks";
import { NavMain } from "@/components/shared/NavMain";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { LogoType, SiteType } from "@/config";
import { useNav } from "@/hooks/use-nav";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  logo: LogoType;
  site: SiteType;
}

export function AppSidebar({ site, logo, ...props }: AppSidebarProps) {
  const appNav = useNav((state) => state.appNav);
  const sysNav = useNav((state) => state.sysNav);
  const { theme = "system" } = useTheme();
  const session = useSession();

  const menu = useMemo(() => {
    if (session.status === "authenticated") return [...appNav, ...sysNav];
    else return appNav;
  }, [session]);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img src={theme === "dark" ? logo.dark : logo.light} alt="Logo" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{site.name}</span>
                  <span className="truncate text-xs">{site.description}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {menu.map(({ name, items }, i) => (
          <NavMain name={name} items={items} key={`nav-${i}`} />
        ))}
        <NavLinks className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
