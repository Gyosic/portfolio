import type { LucideIcon } from "lucide-react";
import {
  Construction,
  Database,
  Gauge,
  Globe,
  Headset,
  LifeBuoy,
  Play,
  Router,
  Shapes,
  ShieldAlert,
  UserCircle,
  WifiCog,
} from "lucide-react";
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
  nav: Array<NavItem>;
  // setNav: (nav: Array<NavItem>) => void;

  links: Array<NavItem>;
  setLinks: (links: Array<NavItem>) => void;

  curNav: NavItem | null;
  setCurNav: (curNav: NavItem) => void;
}

const sysNav: Array<NavItem> = [
  {
    name: "모니터링",
    url: "#",
    items: [{ name: "대시보드", url: "/", icon: Gauge }],
  },
  {
    name: "장치",
    url: "#",
    items: [
      { name: "장치관리", url: "/device", icon: Router },
      { name: "펌웨어관리", url: "/firmware", icon: Shapes },
      { name: "LTE관리", url: "/lte", icon: WifiCog },
    ],
  },
  {
    name: "이력",
    url: "#",
    items: [
      { name: "데이터", url: "/data", icon: Database },
      { name: "응답 이력", url: "/data/audit", icon: Play },
    ],
  },
  {
    name: "관리",
    url: "#",
    items: [
      { name: "사이트관리", url: "/site", icon: Globe },
      { name: "계약관리", url: "/contract", icon: Construction },
      { name: "사용자관리", url: "/user", icon: UserCircle },
    ],
  },
];

const nav: Array<NavItem> = [
  {
    name: "모니터링",
    url: "#",
    items: [{ name: "대시보드", url: "/", icon: Gauge }],
  },
  {
    name: "장치",
    url: "#",
    items: [{ name: "장치관리", url: "/device", icon: Router }],
  },
  {
    name: "이력",
    url: "#",
    items: [{ name: "데이터", url: "/data", icon: Database }],
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
  nav,

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
