import type { LucideIcon } from "lucide-react";
import {
  Award,
  Building2,
  FolderGit2,
  GraduationCap,
  HomeIcon,
  LightbulbIcon,
  LogIn,
  Mail,
  School,
  Settings,
  User as UserIcon,
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
  onClick?: () => void;
}

interface NavState {
  sysNav: Array<NavItem>;
  appNav: Array<NavItem>;

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
      { name: "학위", url: "/admin/education", icon: School },
      { name: "활동", url: "/admin/achievement", icon: Award },
    ],
  },
];

const appNav: Array<NavItem> = [
  {
    name: "메인",
    url: "#",
    items: [
      { name: "Home", icon: HomeIcon, url: "/" },
      { name: "About", icon: UserIcon, url: "/about" },
      { name: "Skills", icon: LightbulbIcon, url: "/skill" },
      { name: "Education", icon: GraduationCap, url: "/education" },
      { name: "History", icon: Building2, url: "/history" },
      { name: "Projects", icon: FolderGit2, url: "/project" },
      { name: "Contact us", icon: Mail, url: "/contact" },
      { name: "Admin", icon: Settings, url: "/admin" },
    ],
  },
];

const links: Array<NavItem> = [{ name: "관리자 로그인", url: "/admin", icon: LogIn }];

const curNav: NavItem | null = null;

export const useNav = create<NavState>((set) => ({
  sysNav,
  appNav,

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
