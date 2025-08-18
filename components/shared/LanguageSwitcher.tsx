"use client";

import { CaseUpper, Heading, Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Language } from "@/lib/i18n/config";
import { useTranslation } from "@/lib/i18n/react";
import { Switcher } from "./Switcher";

interface LanguageSwitcherProps {
  lng: Language;
}
export function LanguageSwitcher({ lng }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation(lng, "translation", {
    useSuspense: false,
  });

  const items = [
    { key: "en", icon: CaseUpper, label: t("EN") },
    { key: "ko", icon: Languages, label: t("KR") },
  ];

  const onClick = (language: string) => {
    const path = pathname.replace(`/${lng}`, `/${language}`);

    router.replace(path);
  };

  return <Switcher items={items} value={lng} onClick={onClick} />;
}
