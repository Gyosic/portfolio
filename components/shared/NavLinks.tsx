"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { createElement, useMemo } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/hooks/use-nav";

export interface NavSecondaryProps {
  items?: Array<NavItem>;
}

export function NavLinks({
  items,
  ...props
}: NavSecondaryProps & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const session = useSession();
  const links = useMemo<Array<NavItem>>(() => {
    if (session.status === "authenticated")
      return [
        { name: "로그아웃", icon: LogOut, onClick: () => signOut({ redirectTo: "/" }), url: "#" },
      ];

    return [];
  }, [session, items]);
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {links.map(({ name, url, icon, onClick }, i) => (
            <SidebarMenuItem key={`nav-link-${i}`}>
              <SidebarMenuButton asChild size="sm">
                <Link href={url} onClick={onClick}>
                  {icon && createElement(icon)}
                  <span>{name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
