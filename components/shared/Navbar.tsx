"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createElement, useEffect, useMemo, useState } from "react";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/animation/DockAnimation";
import { useNav } from "@/hooks/use-nav";
import { Language } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

interface NavbarProps {
  lng?: Language;
  className?: string;
}
const Navbar = ({ lng, className }: NavbarProps) => {
  const appNav = useNav((state) => state.appNav[0].items);
  const [scrolling, setScrolling] = useState(false);
  const pathname = usePathname();
  const href = useMemo(() => {
    return "/" + (pathname.split("/")?.[2] ?? "");
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        `fixed top-5 right-0 left-0 z-[+9999999] m-auto w-full bg-transparent px-0 sm:w-fit sm:px-5 ${scrolling ? "hidden" : "block"}`,
        className,
      )}
    >
      <Dock className="items-end rounded-full pb-3">
        {appNav!.map((item, idx) => (
          <Link href={item.url} key={idx}>
            <DockItem
              className={cn(
                "aspect-square rounded-full bg-gray-200 dark:bg-neutral-800",
                href === item.url && "!border !border-[var(--primary-sky)] bg-gray-100",
              )}
            >
              <DockLabel>{item.name}</DockLabel>
              <DockIcon className={cn(href === item.url && "text-[#2f7df4]")}>
                {item.icon && createElement(item.icon, { className: "h-full w-full" })}
              </DockIcon>
            </DockItem>
          </Link>
        ))}
      </Dock>
    </div>
  );
};

export default Navbar;
