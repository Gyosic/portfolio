import Link from "next/link";
import { createElement } from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/hooks/use-nav";

export interface NavSecondaryProps {
  items: Array<NavItem>;
}

export function NavLinks({
  items,
  ...props
}: NavSecondaryProps & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(({ name, url, icon }, i) => (
            <SidebarMenuItem key={`nav-link-${i}`}>
              <SidebarMenuButton asChild size="sm">
                <Link href={url}>
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
