import React from "react";
import { IThreeColumnSection } from "@/models/widgets/IThreeColumnSection";
import { cn } from "@/lib/utils";

const ThreeColumnSection = ({ columns }: IThreeColumnSection) => {
  return (
    <div className="bg-black text-white">
      <div className="flex w-full flex-col gap-20 px-[1.5rem] lg:mx-auto lg:flex-row lg:px-[5rem] lg:py-[5rem]">
        {columns.map((col, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-1 flex-col gap-4 lg:gap-8",
              !index && "pt-[5rem] lg:pt-0",
              index === columns.length - 1 && "pb-[5rem] lg:pb-0"
            )}
          >
            {col.title && (
              <h3 className="font-gt-america-expanded-bold text-2xl leading-[1.3] uppercase lg:text-4xl lg:leading-normal">
                {col.title}
              </h3>
            )}
            {col.subtitle && (
              <p className="font-gt-america-standard-light text-base leading-normal font-light">{col.subtitle}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreeColumnSection;
