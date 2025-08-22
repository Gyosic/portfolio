"use client";

import { Layers } from "lucide-react";
import { useEffect, useState } from "react";
import FramerWrapper from "@/components/animation/FramerWrapper";
import Heading from "@/components/shared/Heading";
import { Badge } from "@/components/ui/badge";
import { Language } from "@/lib/i18n/config";
import { useTranslation } from "@/lib/i18n/react";
import { ProjectType } from "@/lib/schema/project.schema";
import { ProjectCards } from "./ProjectsCard";

interface ProjectProps {
  projects: ProjectType[];
  lng: Language;
}
export function Project({ projects, lng }: ProjectProps) {
  const { t, ready } = useTranslation(lng, "translation", {
    useSuspense: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!ready || !mounted) return null;

  return (
    // PROJECT PAGE
    <div className="relative flex h-full w-full flex-col items-start gap-5 overflow-hidden px-40 pt-14 pb-4 max-sm:justify-start max-md:p-4 max-md:pt-20">
      <Badge variant="secondary" className="gap-1.5 py-1">
        <Layers className="h-4 w-4" />
        Projects
      </Badge>
      <div className="flex flex-col gap-3">
        <Heading>My Projects</Heading>
        <FramerWrapper y={0} x={200}>
          <p className="w-full font-poppins text-lg text-primary max-sm:text-base">
            {t(
              "Here's a collection of projects I've worked on so far. They range from projects I've worked on with my team at work to side projects I've created out of curiosity. Please feel free to browse through them.",
            )}
          </p>
        </FramerWrapper>
      </div>

      <div className="flex w-full flex-row flex-wrap gap-3 overflow-auto max-lg:flex-col max-lg:flex-nowrap">
        {projects.map((val, indx) => {
          return <ProjectCards key={indx} value={val} num={indx} />;
        })}
      </div>
    </div>
  );
}
