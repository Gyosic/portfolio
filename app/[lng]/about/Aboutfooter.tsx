import { Circle, Dna, Globe2, Languages } from "lucide-react";
import { PersonalType } from "@/config";
import { Language } from "@/lib/i18n/config";
import { useTranslation } from "@/lib/i18n/react";

interface AboutfooterProps {
  personal: PersonalType;
  lng: Language;
}
const Aboutfooter = ({ personal, lng }: AboutfooterProps) => {
  const { t, ready } = useTranslation(lng, "translation", {
    useSuspense: false,
  });

  if (!ready) return null;

  const items = [
    {
      name: t("Language"),
      answer: personal.about.languages.map((l) => t(l)).join(","),
      icon: <Languages className="h-8 w-8" />,
    },
    {
      name: t("Nationality"),
      answer: t(personal?.about?.nationality || ""),
      icon: <Globe2 className="h-8 w-8" />,
    },
    {
      name: t("Gender"),
      answer: t(personal.about.gender || ""),
      icon: <Dna className="h-8 w-8" />,
    },
  ];

  return (
    <>
      {items.map((val, indx) => {
        return (
          <div className="relative w-fit p-1" key={indx}>
            <h1 className="icon_underline relative flex items-center gap-2 font-poppins font-semibold text-3xl text-primary max-sm:text-2xl">
              {val.icon}
              {val.name}
            </h1>
            <div className="flex flex-row items-center justify-center gap-2 pt-3 text-primary text-xl max-lg:justify-start">
              <Circle className="h-3 w-3" /> {val.answer}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Aboutfooter;
