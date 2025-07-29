"use client";

import type { VariantProps } from "class-variance-authority";
import { Moon, Sun } from "lucide-react";
import { useLayoutEffect } from "react";

import type { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { getTheme, toggleTheme } from "@/lib/theme";

export function ThemeToggler(
  props: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>
) {
  const setDocumentDark = (isDark: boolean) =>
    document.documentElement.classList.toggle("dark", isDark);

  useLayoutEffect(() => {
    const theme = getTheme();

    setDocumentDark(theme === "dark" || !theme); // default is dark

    const handleStorage = (e: StorageEvent) =>
      e.key === "theme" && setDocumentDark(e.newValue === "dark");

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <Button size="icon" variant="ghost" onClick={() => toggleTheme()} {...props}>
      <Sun className="hidden dark:block" />
      <Moon className="block dark:hidden" />
    </Button>
  );
}
