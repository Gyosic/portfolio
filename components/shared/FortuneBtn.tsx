"use client";

import { useState } from "react";
import { toast } from "sonner";
import z, { ZodError } from "zod";
import { PersonalType } from "@/config";
import { Language } from "@/lib/i18n/config";
import { useTranslation } from "@/lib/i18n/react";
import HackerBtn from "../animation/HackerBtn";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { TypingText } from "../ui/shadcn-io/typing-text";

const fortuneSchema = z.object({
  name: z.string({ required_error: "'name' 값이 없습니다." }).min(1, "'name' 값이 없습니다."),
  birthday: z
    .string({ required_error: "'birthday' 값이 없습니다." })
    .min(1, "'birthday' 값이 없습니다."),
  birthtime: z
    .string({ required_error: "'birthtime' 값이 없습니다." })
    .min(1, "'birthtime' 값이 없습니다."),
  gender: z.string({ required_error: "'gender' 값이 없습니다." }).min(1, "'gender' 값이 없습니다."),
});

interface FortuneBtnProp {
  lng: Language;
  personal: PersonalType;
}
export function FortuneBtn({ lng, personal }: FortuneBtnProp) {
  const { t, ready } = useTranslation(lng, "translation", {
    useSuspense: false,
  });

  const [fortune, setFortune] = useState({
    summary: "",
    tell: "",
    employment: "",
    wealth: "",
    studies: "",
    business: "",
  });

  if (!ready) return null;

  const handleClick = async () => {
    try {
      const body = fortuneSchema.parse({
        name: personal?.[lng]?.name,
        birthday: personal?.about?.birthday,
        birthtime: personal?.about?.birthtime,
        gender: t(personal?.about?.gender ?? ""),
      });

      const res = await fetch("/api/fortunes", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!res.ok) return toast.error(await res.text());

      const result = await res.json();
      setFortune(result);
    } catch (err) {
      if (err instanceof ZodError) {
        const { message } = err;
        return toast.error(message);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="mt-2 h-fit w-full px-4 py-2">
          <HackerBtn label={t("View employment fortune")} onClick={handleClick} />
        </div>
      </DialogTrigger>
      <DialogContent className="">
        <DialogTitle className="h-fit">
          <TypingText duration={10} text={fortune.summary} className="font-bold text-3xl" />
        </DialogTitle>
        <div className="flex h-full w-full flex-col gap-2">
          <TypingText duration={10} text={fortune.tell} className="text-lg" />
          <div>
            <div className="flex items-start gap-2 text-sm">
              <span className="whitespace-nowrap">취업운: </span>
              <TypingText duration={10} text={fortune.employment} />
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="whitespace-nowrap">재물운: </span>
              <TypingText duration={10} text={fortune.wealth} />
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="whitespace-nowrap">학업운: </span>
              <TypingText duration={10} text={fortune.studies} />
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="whitespace-nowrap">사업운: </span>
              <TypingText duration={10} text={fortune.business} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
