import React from "react";
import RichText from "@/components/RichText";
import { StoryblokRichTextNodeTypes } from "@storyblok/react";
import { ITwoColumnSection } from "@/models/widgets/ITwoColumnSection";
import { cn } from "@/lib/utils";

const TwoColumnSection = ({
  title,
  titleMobile,
  longText,
  bgColor = "#000000",
  fontColor = "#000000",
}: ITwoColumnSection) => {
  return (
    <div style={{ backgroundColor: bgColor }}>
      <div className="lg:mxx-auto flex flex-col gap-4 px-[1.5rem] py-[2.5rem] lg:flex-row lg:justify-between lg:px-[5rem] lg:py-[5rem]">
        {title && (
          <h2
            className={cn(
              "font-gt-america-expanded-bold flex-1 text-[1.25rem] leading-[1.5] uppercase lg:text-[1.5rem] lg:leading-[1.3]",
              fontColor === "#ffffff" ? "text-white" : "text-black",
              titleMobile ? "hidden lg:block" : "block"
            )}
          >
            {title}
          </h2>
        )}

        {titleMobile && (
          <h2
            className={cn(
              "font-gt-america-expanded-bold block flex-1 text-[1.25rem] leading-[1.5] uppercase lg:hidden lg:text-[1.5rem] lg:leading-[1.3]",
              fontColor === "#ffffff" ? "text-white" : "text-black"
            )}
          >
            {titleMobile}
          </h2>
        )}

        {longText && (
          <div className="flex-1">
            <RichText
              doc={{
                ...longText.doc,
                type: "doc" as StoryblokRichTextNodeTypes,
              }}
              className={{
                p: `font-gt-america-standard-light text-base leading-[1.5] font-light ${fontColor === "#ffffff" ? "text-white" : "text-black"}`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoColumnSection;
