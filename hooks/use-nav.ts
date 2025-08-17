import type { LucideIcon } from "lucide-react";
import { Building2, FolderGit2, Headset, LifeBuoy, School } from "lucide-react";
import { User } from "next-auth";
import { create } from "zustand";

export interface NavItem {
  name: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  isPromotion?: boolean;
  items?: Array<NavItem>;
}

interface NavState {
  sysNav: Array<NavItem>;

  links: Array<NavItem>;
  setLinks: (links: Array<NavItem>) => void;

  curNav: NavItem | null;
  setCurNav: (curNav: NavItem) => void;
}

const sysNav: Array<NavItem> = [
  {
    name: "관리",
    url: "#",
    items: [
      { name: "경력", url: "/admin/history", icon: Building2 },
      { name: "프로젝트", url: "/admin/project", icon: FolderGit2 },
      { name: "학력", url: "/admin/education", icon: School },
    ],
  },
];

const links: Array<NavItem> = [
  // {
  //   name: "시스템정보",
  //   url: "/info",
  //   icon: ShieldAlert,
  // },
  {
    name: "지원",
    url: "#",
    icon: LifeBuoy,
  },
  {
    name: "문의",
    url: "#",
    icon: Headset,
  },
];

const curNav: NavItem | null = null;

export const useNav = create<NavState>((set) => ({
  sysNav,

  links,
  setLinks: (links: Array<NavItem>) => set(() => ({ links })),

  curNav,
  setCurNav: (curNav: NavItem) => set(() => ({ curNav })),
}));

interface UserState {
  user: User;
  setUser: (nav: User) => void;
}

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.webp",
};
export const useUser = create<UserState>((set) => ({
  user,
  setUser: (user: User) => set(() => ({ user })),
}));
