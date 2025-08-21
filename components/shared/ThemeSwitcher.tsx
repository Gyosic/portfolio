"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import {
  ThemeToggleButton,
  useThemeTransition,
} from "@/components/ui/shadcn-io/theme-toggle-button";
import { Language } from "@/lib/i18n/config";
import { useTranslation } from "@/lib/i18n/react";
import { Switcher } from "./Switcher";

interface ThemeSwitcherProps {
  lng: Language;
}
export function ThemeSwitcher({ lng }: ThemeSwitcherProps) {
  const { t } = useTranslation(lng, "translation", {
    useSuspense: false,
  });
  const { theme, setTheme } = useTheme();
  const { startTransition } = useThemeTransition();

  const items = [
    { key: "light", icon: Sun, label: t("Light theme"), button: <ThemeToggleButton /> },
    { key: "dark", icon: Moon, label: t("Dark theme"), button: <ThemeToggleButton /> },
  ];

  const handleThemeToggle = useCallback(() => {
    startTransition(() => setTheme((prev) => (prev === "light" ? "dark" : "light")));
  }, [setTheme, startTransition]);

  return <Switcher items={items} value={theme || "light"} onClick={handleThemeToggle} />;
}
