import { LightbulbIcon } from "lucide-react";
import FramerWrapper from "@/components/animation/FramerWrapper";
import Heading from "@/components/shared/Heading";
import { Badge } from "@/components/ui/badge";
import { PersonalType } from "@/config";
import { Language } from "@/lib/i18n/config";
import { iconMap } from "@/lib/icon";
import SkillsFooter from "./SkillFooter";

interface SkillProps {
  personal: PersonalType;
  lng: Language;
}
export function Skill({ personal }: SkillProps) {
  const programmingLanguages = personal.skill.languages.map((l) => ({
    name: l,
    icon: iconMap?.[l.toLowerCase()],
  }));
  const frameworks = personal.skill.frameworks.map((f) => ({
    name: f,
    icon: iconMap?.[f.toLowerCase()],
  }));
  const tools = personal.skill.tools.map((t) => ({
    name: t,
    icon: iconMap?.[t.toLowerCase()],
  }));
  const os = personal.skill.os.map((o) => ({ name: o, icon: iconMap?.[o.toLowerCase()] }));
  return (
    <div className="relative flex h-full w-full flex-col items-start gap-5 overflow-hidden">
      <Badge variant="secondary" className="gap-1.5 py-1">
        <LightbulbIcon className="h-4 w-4" />
        My Skills
      </Badge>
      <div className="flex flex-col gap-3">
        <Heading>My Technical Experience/Skills.</Heading>
        <FramerWrapper y={0} x={200}>
          <p className="w-full font-poppins text-primary text-xl max-sm:text-lg"></p>
        </FramerWrapper>
        <FramerWrapper y={100} delay={0.3} className="block w-full">
          <h1 className="text_underline relative mb-4 flex gap-2 font-poppins font-semibold text-2xl text-primary max-sm:text-xl">
            Programming Languages
          </h1>
          <div className="grid w-full grid-cols-7 gap-4 max-sm:grid-cols-2 max-md:grid-cols-3 max-lg:grid-cols-4">
            <SkillsFooter items={programmingLanguages} />
          </div>
        </FramerWrapper>
        <FramerWrapper className="block w-full" y={100} delay={0.32}>
          <h1 className="text_underline relative mb-4 flex gap-2 font-poppins font-semibold text-2xl text-primary max-sm:text-xl">
            Framework/Libraries
          </h1>
          <div className="grid w-full grid-cols-7 gap-4 max-sm:grid-cols-2 max-md:grid-cols-3 max-lg:grid-cols-4">
            <SkillsFooter items={frameworks} />
          </div>
        </FramerWrapper>
        <FramerWrapper className="block w-full" y={100} delay={0.34}>
          <h1 className="text_underline relative mb-4 flex gap-2 font-poppins font-semibold text-2xl text-primary max-sm:text-xl">
            Tools & Technologies
          </h1>
          <div className="grid w-full grid-cols-7 gap-4 max-sm:grid-cols-2 max-md:grid-cols-3 max-lg:grid-cols-4">
            <SkillsFooter items={tools} />
          </div>
        </FramerWrapper>
        <FramerWrapper className="block w-full" y={100} delay={0.34}>
          <h1 className="text_underline relative mb-4 flex gap-2 font-poppins font-semibold text-2xl text-primary max-sm:text-xl">
            OS/Environment
          </h1>
          <div className="grid w-full grid-cols-7 gap-4 max-sm:grid-cols-2 max-md:grid-cols-3 max-lg:grid-cols-4">
            <SkillsFooter items={os} />
          </div>
        </FramerWrapper>
      </div>
    </div>
  );
}
