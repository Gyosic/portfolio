"use client";

import FramerWrapper from "@/components/animation/FramerWrapper";
import { tableBodyData } from "@/components/shared/DataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { achievementModel } from "@/lib/schema/achievement.schema";
import { cn } from "@/lib/utils";

interface AchievementCardProps {
  value: {
    title: string;
    description: string;
    date: string;
    type: string;
  };
  num: number;
  className?: string;
}

const AchievementCards: React.FC<AchievementCardProps> = ({ value, num, className }) => {
  return (
    <FramerWrapper
      className={cn("max-w-[32%] max-lg:max-w-full", className)}
      y={0}
      scale={0.8}
      delay={num / 4}
      duration={0.15}
    >
      <Card className="flex h-full w-full flex-col border-2 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="font-bold text-primary text-xl">{value.title}</CardTitle>
          <CardDescription>
            {value.date} | {tableBodyData(value.type, achievementModel["type"])}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-grow flex-col gap-4">
          <pre className="text-wrap text-muted-foreground text-sm leading-relaxed">
            {value.description}
          </pre>
        </CardContent>
      </Card>
    </FramerWrapper>
  );
};

export default AchievementCards;
