import Image from "next/image";
import React from "react";

interface MyComponentProps {
  items: Array<{ alt?: string; name?: string; icon?: string }>;
}

const SkillsFooter: React.FC<MyComponentProps> = ({ items }) => {
  return (
    <>
      {items &&
        items.map((item, index) => {
          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 transition-colors hover:bg-accent"
            >
              <img src={item.icon} alt={item.name} className="h-12 w-12 object-contain" />
              <span className="text-center font-medium text-muted-foreground text-sm">
                {item.name}
              </span>
            </div>
          );
        })}
    </>
  );
};

export default SkillsFooter;
