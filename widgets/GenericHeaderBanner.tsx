import React from "react";
import RichText from "@/components/RichText";
import { StoryblokRichTextNodeTypes } from "@storyblok/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IGenericHeaderBanner } from "@/models/widgets/IGenericHeaderBanner";

const GenericHeaderBanner = ({ title, body, cta, theme = "dark", topPadding, bottomPadding, ctaWidth }: IGenericHeaderBanner) => {
  const isDark = theme === "dark";

  return (
    <div className={`${isDark ? "bg-black" : "bg-white"}`}>
      {/* added to serve as padding for pages that have fixed banners */}
      {topPadding && <div className={`pt-20 lg:pt-24 ${isDark ? "bg-black" : "bg-white"}`} />}
      <div
        style={{ paddingBottom: bottomPadding }}
        className={`flex w-full flex-col items-start gap-4 p-[1.5rem] text-left lg:p-[5rem]`}
      >
        {title && (
          <h2
            className={`font-gt-america-expanded-bold text-2xl leading-normal uppercase lg:text-4xl ${isDark ? "text-white" : "text-black"}`}
          >
            {title}
          </h2>
        )}
        {body && (
          <RichText
            doc={{
              ...body.doc,
              type: "doc" as StoryblokRichTextNodeTypes,
            }}
            className={{
              p: `font-gt-america-standard-light text-base leading-normal font-light ${isDark ? "text-white" : "text-black"}`,
            }}
          />
        )}

        {cta?.href && (
          <Button
            asChild
            style={ctaWidth ? { width: ctaWidth } : undefined}
            className={`mt-4 flex items-center rounded-none border bg-transparent px-4 py-6 !font-bold hover:bg-transparent ${ctaWidth ? "" : "w-full"} lg:!w-fit ${isDark ? "border-white text-white" : "border-black text-black"}`}
          >
            <Link href={cta.href}>
              <span className="font-gt-america-expanded-bold text-sm !font-bold">{cta.text}</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default GenericHeaderBanner;
