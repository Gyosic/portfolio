"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { createElement, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type ItemType = {
  key: string;
  icon: LucideIcon;
  label: string;
};

export type ThemeSwitcherProps = {
  items: ItemType[];
  className?: string;
  value?: string;
  onClick?: (value: string) => void;
};

export const Switcher = ({ items, className, value, onClick }: ThemeSwitcherProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "relative isolate flex h-8 rounded-full bg-background p-1 ring-1 ring-border",
        className,
      )}
    >
      {items.map(({ key, icon, label }) => {
        const isActive = value === key;

        return (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <button
                aria-label={label}
                className="relative h-6 w-6 rounded-full"
                key={key}
                onClick={() => onClick?.(key)}
                type="button"
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-secondary"
                    layoutId="activeTheme"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                {createElement(icon, {
                  className: cn(
                    "relative z-10 m-auto h-4 w-4",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  ),
                })}
              </button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};
