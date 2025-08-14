"use client";

import { ChevronRight } from "lucide-react";

import Link from "next/link";
import { createElement } from "react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { type NavItem, useNav } from "@/hooks/use-nav";

export interface NavMainProps {
  name?: string;
  items?: Array<NavItem>;
}

export function NavMain({ name, items }: NavMainProps) {
  const { setCurNav } = useNav((state) => state);

  const handleMenuClick = (item: NavItem) => {
    setCurNav(item);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{name}</SidebarGroupLabel>
      <SidebarMenu>
        {items?.map(({ name, url, icon, items, isActive }, i) => (
          <Collapsible key={`nav-item-${i}`} asChild defaultOpen={isActive}>
            <SidebarMenuItem>
              {items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild tooltip={name} className="group">
                      <Link
                        href={`${url}`}
                        onClick={() => handleMenuClick({ name, url, icon, items, isActive })}
                      >
                        {icon && createElement(icon)}
                        <span>{name}</span>
                        <SidebarMenuAction className="group-data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="CollapsibleContent">
                    <SidebarMenuSub>
                      {items?.map((subItem, j) => (
                        <SidebarMenuSubItem key={`nav-sub-items-${j}`}>
                          <SidebarMenuSubButton asChild>
                            <Link href={`${subItem.url}`} onClick={() => handleMenuClick(subItem)}>
                              <span>{subItem.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <SidebarMenuButton asChild tooltip={name}>
                  <Link
                    href={`${url}`}
                    onClick={() => handleMenuClick({ name, url, icon, items, isActive })}
                  >
                    {icon && createElement(icon)}
                    <span>{name}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
