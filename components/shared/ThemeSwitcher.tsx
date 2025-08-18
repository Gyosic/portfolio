"use client";

import { Moon, Sun } from "lucide-react";
import { useLayoutEffect, useMemo, useState } from "react";
import { Language } from "@/lib/i18n/config";
import { useTranslation } from "@/lib/i18n/react";
import { getTheme, setTheme } from "@/lib/theme";
import { Switcher } from "./Switcher";

interface ThemeSwitcherProps {
  lng: Language;
}
export function ThemeSwitcher({ lng }: ThemeSwitcherProps) {
  const { t } = useTranslation(lng, "translation", {
    useSuspense: false,
  });

  const items = [
    { key: "light", icon: Sun, label: t("Light theme") },
    { key: "dark", icon: Moon, label: t("Dark theme") },
  ];
  const [change, setChange] = useState(false);
  const theme = useMemo(() => getTheme(), [change]);

  const setDocumentDark = (isDark: boolean) =>
    document.documentElement.classList.toggle("dark", isDark);

  useLayoutEffect(() => {
    const theme = getTheme();

    setDocumentDark(theme === "dark" || !theme); // default is dark

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "theme") {
        setDocumentDark(e.newValue === "dark");
        setChange((prev) => !prev);
        return;
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return <Switcher items={items} value={theme || "dark"} onClick={setTheme} />;
}
