import React from "react";
import Link from "next/link";
import { ITwoColumnText } from "@/models/widgets/ITwoColumnText";
import { Button } from "@/components/ui/button";
import RichText from "@/components/RichText";
import { StoryblokRichTextNodeTypes } from "@storyblok/react";

const TwoColumnText = ({ columns = [] }: ITwoColumnText) => {
  return (
    <div className="px-8 py-10 lg:px-20 lg:py-20">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-14">
        {columns.map((col, index) => (
          <div key={index} className={`flex flex-col gap-4 lg:w-1/2${index > 0 ? " lg:ml-auto lg:w-[80%] lg:pl-[95px]" : ""}`}>
            {col.title && (
              <h2
                className={`font-gt-america-expanded-bold text-xl text-black uppercase${index === 0 ? " lg:text-2xl" : ""}`}
              >
                {col.title}
              </h2>
            )}
            {col.subtitle && (
              <RichText
                doc={{
                  ...col.subtitle.doc,
                  type: "doc" as StoryblokRichTextNodeTypes,
                }}
                className={{
                  p: "font-gt-america-standard-light text-base leading-relaxed text-black",
                }}
              />
            )}
            {col.cta?.href && (
              <Button
                asChild
                className="mt-4 flex w-full items-center rounded-none border border-black bg-transparent px-4 py-6 text-black hover:bg-transparent lg:w-fit"
              >
                <Link href={col.cta.href}>
                  <span className="font-gt-america-expanded-bold text-sm">{col.cta.text}</span>
                </Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TwoColumnText;
