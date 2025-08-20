"use client";

import {
  FolderGit2,
  GraduationCap,
  History,
  HomeIcon,
  LightbulbIcon,
  Mail,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/animation/DockAnimation";
import { Language } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

interface NavbarProps {
  lng?: Language;
  className?: string;
}
const Navbar = ({ lng, className }: NavbarProps) => {
  const data = [
    {
      title: "Home",
      icon: <HomeIcon className="h-full w-full" />,
      href: "/",
    },
    {
      title: "About",
      icon: <User className="h-full w-full" />,
      href: "/about",
    },
    {
      title: "Skills",
      icon: <LightbulbIcon className="h-full w-full" />,
      href: "/skill",
    },
    {
      title: "Education",
      icon: <GraduationCap className="h-full w-full" />,
      href: "/education",
    },
    {
      title: "History",
      icon: <History className="h-full w-full" />,
      href: "/history",
    },
    {
      title: "Projects",
      icon: <FolderGit2 className="h-full w-full" />,
      href: "/project",
    },

    {
      title: "Contact us",
      icon: <Mail className="h-full w-full" />,
      href: "/contact",
    },
    {
      title: "Admin",
      icon: <Settings className="h-full w-full" />,
      href: "/admin",
      items: [
        {
          title: "Projects",
          href: "/admin/projects",
          icon: <Settings className="h-full w-full" />,
        },
      ],
    },
  ];
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
        {data.map((item, idx) => (
          <Link href={item.href} key={idx}>
            <DockItem
              className={cn(
                "aspect-square rounded-full bg-gray-200 dark:bg-neutral-800",
                href === item.href && "!border !border-[var(--primary-sky)] bg-gray-100",
              )}
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon className={cn(href === item.href && "text-[#2f7df4]")}>
                {item.icon}
              </DockIcon>
            </DockItem>
          </Link>
        ))}
      </Dock>
    </div>
  );
};

export default Navbar;
