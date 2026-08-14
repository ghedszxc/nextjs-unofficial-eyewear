import React from "react";
import Image from "next/image";
import RichText from "@/components/RichText";
import { StoryblokRichTextNodeTypes } from "@storyblok/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ICampaignBanner } from "@/models/widgets/ICampaignBanner";
import { imageSizes } from "@/lib/image-sizes";

const CampaignBanner = ({ title, body, image, cta, theme = "light", bodyMaxWidth }: ICampaignBanner) => {
  const isDark = theme === "dark";
  return (
    <div className="relative">
      <div className="relative h-[500px] md:h-[640px] lg:h-auto">
        {/* Image */}

        {/* Mobile */}
        {image?.mobile?.url && (
          <Image
            className="object-cover lg:hidden"
            src={image?.mobile?.url}
            alt={image?.mobile?.alt as string}
            fill
            sizes={imageSizes({ base: "100vw", lg: "100vw" })}
            priority
          />
        )}

        {/* Desktop */}
        {image?.desktop?.url && (
          <Image
            className="hidden h-[100vh] object-cover w-full lg:block"
            src={image?.desktop?.url}
            alt={image?.desktop?.alt as string}
            width={0}
            height={0}
            sizes="100vw"
            priority
          />
        )}
      </div>

      {/* Text Content */}
      {(title || body?.doc?.content?.[0].content?.[0] || cta?.href) && (
        <div className="w-full lg:bg-[linear-gradient(180deg,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.50)_70%,_rgba(0,0,0,0.50)_100%)] lg:bg-blend-multiply lg:absolute lg:bottom-0">
          <div className="flex flex-col gap-4 px-6 py-[2rem] lg:p-8">
            <div className="flex flex-col gap-2">
              {title && (
                <h3
                  className={`font-gt-america-expanded-bold text-[1.5rem] ${isDark ? "text-black lg:text-white" : "text-black"}`}
                >
                  {title}
                </h3>
              )}

              {body && (
                <div className={bodyMaxWidth ? "cb-body-width" : ""} {...(bodyMaxWidth ? { style: { ['--cb-body-w' as string]: bodyMaxWidth } } : {})}>
                  {bodyMaxWidth && (
                    <style>{`@media(min-width:1024px){.cb-body-width{width:var(--cb-body-w)}}`}</style>
                  )}
                  <RichText
                    doc={{
                      ...body.doc,
                      type: "doc" as StoryblokRichTextNodeTypes,
                    }}
                    className={{
                      p: `font-gt-america-standard-light text-base font-light ${isDark ? "text-black lg:text-white" : "text-black"}`,
                    }}
                  />
                </div>
              )}
            </div>

            {cta?.href && (
              <Button
                asChild
                className={`flex w-full items-center rounded-none border bg-transparent px-8 py-3 font-bold hover:bg-transparent lg:w-fit ${isDark ? "border-black text-black lg:border-white lg:text-white" : "border-black text-black"}`}
              >
                <Link href={cta?.href}>
                  <h5 className="font-gt-america-expanded-bold text-sm">{cta?.text}</h5>
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default CampaignBanner;
