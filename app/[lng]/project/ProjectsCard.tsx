import { ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";
import FramerWrapper from "@/components/animation/FramerWrapper";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectType } from "@/lib/schema/project.schema";
import { skills } from "@/lib/skill";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  value: ProjectType;
  num: number;
  className?: string;
}

export function ProjectCards({ value, num, className }: ProjectCardProps) {
  return (
    <FramerWrapper
      className={cn("max-w-[32%] max-lg:max-w-full", className)}
      y={0}
      scale={0.8}
      delay={num / 4}
      duration={0.15}
    >
      <Card
        className={cn(
          "flex h-full w-full flex-col border-2 transition-all duration-300 hover:shadow-lg",
          className,
        )}
      >
        <CardHeader className="pb-2">
          <CardTitle className="font-bold text-primary text-xl">{value.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-grow flex-col gap-4">
          <pre className="text-wrap font-rubik text-muted-foreground text-sm leading-relaxed">
            {value.description}
          </pre>

          <div className="flex flex-wrap gap-2">
            {value.skills.map((tag: string, index: number) => {
              const { color = "bg-gray-100 text-gray-800", label } =
                skills.find(({ value }) => value === tag) || {};

              return (
                <span
                  key={index}
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${color}`}
                >
                  {label}
                </span>
              );
            })}
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          {!!value?.link && (
            <Link
              href={value.link}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({
                  variant: "default",
                  size: "sm",
                }),
                "group w-fit transition-all hover:translate-y-[-2px] hover:shadow-md",
              )}
            >
              Visit Project
              <ArrowUpRight className="-translate-x-2 ml-1 hidden h-4 w-4 transition-all duration-200 group-hover:block group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          )}
          {!!value?.repo && (
            <Link
              href={value.repo}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({
                  variant: "default",
                  size: "sm",
                }),
                "group w-fit transition-all hover:translate-y-[-2px] hover:shadow-md",
              )}
            >
              <Github />
              GitHub
              <ArrowUpRight className="-translate-x-2 ml-1 hidden h-4 w-4 transition-all duration-200 group-hover:block group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          )}
        </CardFooter>
      </Card>
    </FramerWrapper>
  );
}
