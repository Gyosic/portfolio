"use client";

import Link from "next/link";
import { Session } from "next-auth";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { NavLinks } from "@/components/shared/NavLinks";
import { NavMain } from "@/components/shared/NavMain";
// import { NavProjects } from "@/components/NavProjects";
import { NavUser } from "@/components/shared/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { LogoType, SiteType } from "@/config";
import { useNav, useUser } from "@/hooks/use-nav";

interface SysAppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  logo: LogoType;
  site: SiteType;
  session: Session | null;
}

export function SysAppSidebar({ site, logo, session, ...props }: SysAppSidebarProps) {
  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);
  const sysNav = useNav((state) => state.sysNav);
  const links = useNav((state) => state.links);
  const { theme = "system" } = useTheme();

  useEffect(() => {
    const { user: sessionUser } = session || {};
    if (sessionUser) setUser(sessionUser);
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
        {sysNav.map(({ name, items }, i) => (
          <NavMain name={name} items={items} key={`nav-${i}`} />
        ))}
        <NavLinks items={links} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
