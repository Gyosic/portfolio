"use client";

import { Circle, Heart, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import FramerWrapper from "@/components/animation/FramerWrapper";
import Heading from "@/components/shared/Heading";
import { Badge } from "@/components/ui/badge";
import { PersonalType } from "@/config";
import { Language } from "@/lib/i18n/config";
import { useTranslation } from "@/lib/i18n/react";
import { AchievementType } from "@/lib/schema/achievement.schema";
import Aboutfooter from "./Aboutfooter";
import AchievementCards from "./AchievementCard";

interface AboutProps {
  personal: PersonalType;
  lng: Language;
  achievements: AchievementType[];
}

export function About({ personal, lng, achievements }: AboutProps) {
  const { t, ready } = useTranslation(lng, "translation", {
    useSuspense: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!ready || !mounted) return null;

  const items = personal.about.hobbies.map((hobby) => ({ hobby: t(hobby) }));

  return (
    // ABOUT PAGE
    <div className="relative flex h-full w-full flex-col items-start gap-5 overflow-auto px-40 pt-14 pb-4 max-sm:justify-start max-md:p-4 max-md:pt-20">
      <Badge variant="secondary" className="gap-1.5 py-1">
        <User2 className="h-4 w-4" />
        About me
      </Badge>
      <div className="flex flex-col gap-5">
        <Heading>{personal?.[lng]?.title}</Heading>

        <FramerWrapper y={0} x={100}>
          <p className="w-full font-poppins text-primary text-xl max-sm:text-lg">
            {personal.about.bio}
          </p>
        </FramerWrapper>
      </div>
      <FramerWrapper
        className="flex w-full flex-row justify-between max-lg:flex-col"
        y={100}
        delay={0.3}
      >
        <Aboutfooter personal={personal} lng={lng} />
      </FramerWrapper>
      <FramerWrapper className="block" y={100} delay={0.31}>
        <h1 className="icon_underline relative flex gap-2 font-poppins font-semibold text-3xl text-primary max-sm:text-2xl">
          <Heart className="h-8 w-8" /> {t("Hobbies")}
        </h1>
        <div className="flex h-fit w-full flex-row justify-between gap-7 p-2 max-lg:flex-col">
          {items.map((val, indx) => {
            return (
              <div
                key={indx}
                className="flex flex-row items-center justify-center gap-2 pt-3 text-primary text-xl max-lg:justify-start"
              >
                <Circle className="h-3 w-3" /> {val.hobby}
              </div>
            );
          })}
        </div>
      </FramerWrapper>

      <div className="flex w-full flex-col gap-5">
        <Heading>{t("Awards/Certificates/Others")}</Heading>

        <div className="flex w-full flex-wrap gap-3 max-lg:flex-col">
          {achievements.map((val, indx) => {
            return <AchievementCards className="flex-1" key={indx} value={val} num={indx} />;
          })}
        </div>
      </div>
    </div>
  );
}
