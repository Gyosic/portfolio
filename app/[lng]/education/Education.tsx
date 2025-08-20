import { Briefcase } from "lucide-react";
import FramerWrapper from "@/components/animation/FramerWrapper";
import Heading from "@/components/shared/Heading";
import { Badge } from "@/components/ui/badge";
import { EducationType, educationDegree } from "@/lib/schema/education.schema";

const exchangeDegree = (value: string) => {
  const degree = Object.entries(educationDegree).find(([, degree]) => value === degree);

  if (degree) return degree[0];

  return value;
};
interface EducationProps {
  educations: EducationType[];
}
export function Education({ educations }: EducationProps) {
  return (
    // ABOUT PAGE
    <div className="relative flex h-full w-full flex-col justify-center gap-5 overflow-hidden max-sm:justify-start">
      <Badge variant="secondary" className="gap-1.5 py-1">
        <Briefcase className="h-4 w-4" />
        Education
      </Badge>
      <div className="flex flex-col gap-3">
        <Heading>My Education</Heading>
      </div>
      <div className="flex h-fit w-full flex-col">
        {educations.map((edu, index) => (
          <div className="flex h-fit w-full" key={index}>
            <FramerWrapper
              y={0}
              x={-100}
              delay={0.35 + index * 0.1}
              className="flex w-1/4 items-center justify-evenly font-rubik text-lg max-sm:text-base"
            >
              {`${edu.start} ~ ${edu.end}`}
            </FramerWrapper>
            <FramerWrapper
              y={0}
              x={100}
              delay={0.35 + index * 0.1}
              className="education_point relative w-3/4 gap-3 border-l-4 border-l-[#3c3c3c] p-4"
            >
              <div className="font-rubik text-2xl max-sm:text-xl">
                {exchangeDegree(edu.degree)}, <br /> {`${edu.institution} (${edu.major})`}
              </div>
              <p className="w-full font-poppins text-base text-primary max-sm:text-xs">
                {edu.description}
              </p>
            </FramerWrapper>
          </div>
        ))}
      </div>
    </div>
  );
}
