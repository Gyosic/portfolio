"use client";

import { CaseUpper, Heading, Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Language } from "@/lib/i18n/config";
import { Switcher } from "./Switcher";

interface LanguageSwitcherProps {
  lng: Language;
}
export function LanguageSwitcher({ lng }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const items = [
    { key: "en", icon: CaseUpper, label: "EN" },
    { key: "ko", icon: Languages, label: "KR" },
  ];

  const onClick = (language: string) => {
    const path = pathname.replace(`/${lng}`, `/${language}`);

    router.replace(path);
  };

  return <Switcher items={items} value={lng} onClick={onClick} />;
}
