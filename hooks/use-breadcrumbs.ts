import { create } from "zustand";

export interface BreadcrumbItem {
  text: string;
  href?: string;
}

interface BreadcrumbState {
  breadcrumbs: Array<BreadcrumbItem>;
  setBreadcrumbs: (breadcrumbs: Array<BreadcrumbItem>) => void;
}

export const useBreadcrumbs = create<BreadcrumbState>((set) => ({
  breadcrumbs: [],
  setBreadcrumbs: (breadcrumbs: Array<BreadcrumbItem>) => set(() => ({ breadcrumbs })),
}));
