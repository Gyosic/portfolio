"use client";

import { Mail, MapPinned, MessageSquareText, Phone } from "lucide-react";
import { PersonalType } from "@/config";
import { Language } from "@/lib/i18n/config";
import { useTranslation } from "@/lib/i18n/react";
import TextRotator from "./TextRotator";

interface HeroTextProps {
  lng: Language;
  personal: PersonalType;
}
const HeroTexts = ({ lng, personal }: HeroTextProps) => {
  const { t, ready } = useTranslation(lng, "translation", {
    useSuspense: false,
  });
  // Get the name parts
  const name = personal?.[lng]?.name;
  const location = personal?.[lng]?.location;
  // const nameParts = (personal as PersonalType)?.name.split(" ");
  // const firstName = nameParts[0];
  // const middleName = nameParts.length > 2 ? nameParts[1] : "";
  // const lastName = nameParts.length > 2 ? nameParts[2] : nameParts[1];

  if (!ready) return null;

  return (
    <>
      {/* <h3 className="font-poppins text-2xl max-sm:text-xl">{`${t("Hello")}.`}</h3> */}
      <h1 className="name_underline font-rubik text-8xl text-primary max-sm:text-6xl">
        {/* {firstName} {middleName} <br /> {lastName} . */}
        {name}
      </h1>
      <TextRotator mainText={t("I am a full stack developer")} rotateText={personal.roles} />
      {personal.phone && (
        <span className="flex gap-2 font-rubik">
          <Phone />
          {personal.phone}
        </span>
      )}
      {personal.email && (
        <span className="flex gap-2 font-rubik">
          <Mail />
          {personal.email}
        </span>
      )}
      {location && (
        <span className="flex gap-2 font-rubik">
          <MapPinned />
          {location}
        </span>
      )}
      {personal.social.blog && (
        <span className="flex gap-2 font-rubik">
          <MessageSquareText />
          {personal.social.blog}
        </span>
      )}
    </>
  );
};
export default HeroTexts;
