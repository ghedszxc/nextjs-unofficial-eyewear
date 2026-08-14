import React from "react";
import Image from "next/image";
import RichText from "@/components/RichText";
import { StoryblokRichTextNodeTypes } from "@storyblok/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IGenericFullWidthBanner } from "@/models/widgets/IGenericFullWidthBanner";
import { imageSizes } from "@/lib/image-sizes";

// Temporary hardcoded data until we integrate with Storyblok
const data = {
  image: {
    mobile: {
      src: "/images/pdp/campaign-banner-m.png",
      alt: "Campaign Banner Mobile",
    },
    desktop: {
      src: "/images/pdp/campaign-banner-d.png",
      alt: "Campaign Banner Desktop",
    },
  },
  title: "reframe the ordinary",
  body: "Replenish your looks with our newest eyeglasses and turn all your fits into something that feels even more like you.",
  cta: {
    text: "discover collection",
    href: "/collections",
  },
};

const GenericFullWidthBanner = (bannerProps: IGenericFullWidthBanner) => {
  const { image, title, body, cta } = bannerProps;
  return (
    <section>
      <div className="relative text-black lg:text-white">
        <div className="relative h-[500px] md:h-[640px] lg:h-[810px]">
          {/* Image */}

          {/* Mobile */}
          {image?.mobile?.src && (
            <Image
              className="object-cover lg:hidden"
              src={image?.mobile?.src}
              alt={image?.mobile?.alt as string}
              fill
              sizes={imageSizes({ base: "100vw", lg: "100vw" })}
              
            />
          )}

          {/* Desktop */}
          {image?.desktop?.src && (
            <Image
              className="hidden object-cover lg:block"
              src={image?.desktop?.src}
              alt={image?.desktop?.alt as string}
              fill
              sizes={imageSizes({ base: "100vw", lg: "100vw" })}
              
            />
          )}
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-8 p-6 lg:absolute lg:bottom-0 lg:p-8">
          <div className="flex flex-col gap-4">
            {title && <h3 className="font-gt-america-expanded-bold text-2xl uppercase">{title}</h3>}
            {body && (
              <RichText
                doc={body.doc}
                className={{
                  p: "font-gt-america-standard-light max-w-[688px] text-base leading-[150%]",
                }}
              />
            )}
          </div>

          {cta?.href && (
            <Button
              asChild
              className="flex h-[50px] w-full items-center rounded-none border border-black bg-transparent p-4 hover:bg-[#0000004D] lg:w-fit lg:min-w-[332px] lg:flex lg:place-items-end-safe lg:border-white"
            >
              <Link href={cta?.href} className="text-sm">
                <span className="font-gt-america-expanded-bold text-black uppercase lg:text-white">{cta?.text}</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
export default GenericFullWidthBanner;
