"use client";

import React from "react";
import { RotatingText } from "../ui/shadcn-io/rotating-text";

interface TextRotatorProps {
  mainText: string;
  rotateText: string[];
}

function TextRotator({ mainText, rotateText }: TextRotatorProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-md py-4">
      <div className="font-poppins text-base text-gray-700 [text-wrap:balance] sm:text-2xl">
        {mainText} &
        <span className="ml-2 inline-flex h-[calc(theme(fontSize.lg)*theme(lineHeight.tight))] flex-col overflow-hidden sm:h-[calc(theme(fontSize.3xl)*theme(lineHeight.tight))]">
          <ul className="block text-left font-rubik text-lg leading-tight sm:text-3xl [&_li]:block">
            <li>
              <RotatingText className="text-[#2f7df4]" text={rotateText} />
            </li>
            {/* {rotateText.map((text, index) => (
              <li key={index} className="text-[#2f7df4]">
                {text}
              </li>
            ))} */}
          </ul>
        </span>
      </div>
    </div>
  );
}

export default TextRotator;
