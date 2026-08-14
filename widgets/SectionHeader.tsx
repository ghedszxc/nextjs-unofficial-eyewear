import { ISectionHeader } from "@/models/widgets/ISectionHeader";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RichText from "@/components/RichText";

const SectionHeader = ({
  title,
  subtitle,
  withSubtitle,
  cta,
  maxWidth,
  titleFontSize,
  titleFontSizeMobile,
  titleFontFamily,
  paddingTop,
}: ISectionHeader) => {
  return (
    <div
      className={`px-[24px] pt-[24px] pb-[24px] text-[#000000] lg:p-20 lg:!pt-[80px] ${withSubtitle ? "px-5 pb-20 text-[#000000] lg:px-20" : ""} ${!paddingTop && withSubtitle ? "pt-30" : ""}`}
      style={paddingTop ? { paddingTop } : undefined}
    >
      {(titleFontSize || titleFontSizeMobile) && (
        <style>{`
          .section-header-richtext { font-size: ${titleFontSizeMobile || titleFontSize}; }
          @media (min-width: 1024px) {
            .section-header-richtext { font-size: ${titleFontSize || titleFontSizeMobile}; }
          }
        `}</style>
      )}
      {title && (
        <h2 className="font-gt-america-expanded-bold text-2xl !font-bold tracking-tight uppercase md:text-4xl">
          {title}
        </h2>
      )}
      {subtitle?.doc && (
        <div className={titleFontSize || titleFontSizeMobile ? "section-header-richtext" : ""}>
          <RichText
            doc={subtitle.doc}
            className={{
              div: `${maxWidth ? `max-w-${maxWidth}` : "max-w-full"} mt-4`,
              p: `${titleFontSize || titleFontSizeMobile ? "" : "text-base md:text-2xl lg:text-base"} ${titleFontFamily || "font-gt-america-standard-light"} !font-[300]`,
            }}
          />
        </div>
      )}
      {cta?.href && (
        <Button
          asChild
          className="mt-6 flex w-full items-center rounded-none border border-black bg-transparent px-4 py-6 !font-bold text-black hover:bg-transparent lg:w-fit"
        >
          <Link href={cta.href}>
            <span className="font-gt-america-expanded-bold text-sm !font-bold">{cta.text}</span>
          </Link>
        </Button>
      )}
    </div>
  );
};

export default SectionHeader;
