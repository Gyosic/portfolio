"use client";

import debounce from "lodash.debounce";
// import { usePathname } from "next/navigation";
import { createElement, Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ThemeToggler } from "@/components/shared/ThemeToggler";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
// import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { NavItem, useNav } from "@/hooks/use-nav";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "../ui/sidebar";

export default function Header() {
  // const { breadcrumbs, setBreadcrumbs } = useBreadcrumbs((state) => state);
  // const { curNav, sysNav } = useNav((state) => state);
  // const pathname = usePathname();

  const headerRef = useRef<HTMLElement>(null);

  const [scrolled, setScrolled] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (!headerRef.current) return;

    const handleScroll = debounce(() => setScrolled(window.scrollY > 0), 100, {
      leading: true,
      trailing: true,
    });

    document.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [headerRef, setScrolled]);

  // const findMenu = (items: NavItem[], url: string) => {
  //   const path: NavItem[] = [];

  //   const dfs = (node: NavItem, currentPath: NavItem[]) => {
  //     const newPath = [...currentPath, node];
  //     if (node.url === url) {
  //       path.push(...newPath);
  //       return true;
  //     }

  //     if (node.items) {
  //       for (const item of node.items) {
  //         if (dfs(item, newPath)) return true;
  //       }
  //     }

  //     return false;
  //   };

  //   for (const item of items) {
  //     if (dfs(item, [])) break;
  //   }

  //   return path;
  // };

  // useEffect(() => {
  //   const menus = findMenu(sysNav, curNav?.url ?? pathname);

  //   const breadcrumb = menus.map((menu) => ({
  //     text: menu.name,
  //     icon: menu.icon,
  //     href: menu.url,
  //   }));

  //   setBreadcrumbs(breadcrumb);
  // }, [curNav]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "transition-all duration-200 ease-in-out",
        "sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
        {
          "border-secondary border-b shadow-lg backdrop-blur-xs": scrolled,
        },
      )}
    >
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <ThemeToggler className="-ml-1 h-7 w-7" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {/* <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map(({ text, href, icon }, i, src) =>
              src.length - 1 === i ? (
                <BreadcrumbItem key={`breadcrumb-${i}`}>
                  <BreadcrumbPage className="flex items-center gap-1">
                    {icon && createElement(icon, { className: "size-4" })}
                    {text}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <Fragment key={`breadcrumb-${i}`}>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={href} className="flex items-center gap-1">
                      {icon && createElement(icon, { className: "size-4" })}
                      {text}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </Fragment>
              ),
            )}
          </BreadcrumbList>
        </Breadcrumb> */}
      </div>
    </header>
  );
}
