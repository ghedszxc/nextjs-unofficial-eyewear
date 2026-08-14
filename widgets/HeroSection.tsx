import React from "react";
import Image from "next/image";
import Link from "next/link";
import RichText from "@/components/RichText";
import { imageSizes } from "@/lib/image-sizes";
import { IHeroSection } from "@/models/widgets/IHeroSection";

const HeroSection = ({ title1, title2, body, visual, icon, link, isVideo = false }: IHeroSection) => {
  return (
    <div className="relative h-screen w-full px-6 py-8 lg:p-8">
      {/* Visual - Mobile */}
      {visual?.mobile.url && (
        <Image
          src={visual?.mobile?.url}
          alt={visual?.mobile?.alt}
          fill
          sizes={imageSizes({ base: "100vw", lg: "100vw" })}
          className="object-cover lg:hidden"
          priority
        />
      )}

      {/* Visual - Desktop */}
      {visual?.desktop.url && (
        <Image
          src={visual?.desktop?.url}
          alt={visual?.desktop?.alt}
          fill
          sizes={imageSizes({ base: "100vw", lg: "100vw" })}
          className="hidden object-cover lg:block"
          priority
        />
      )}

      {/* Linear Gradient Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0)_30%,rgba(0,0,0,0)_50%,rgba(0,0,0,.75)_100%)]" />

      {/* Text Content */}
      <div className="absolute bottom-8 flex flex-col text-white lg:text-white">
        <div className="mb-2 lg:mb-4">
          {title1 && <h2 className="font-gt-america-expanded-bold text-[1.5rem]">{title1}</h2>}
          {title2 && <h2 className="font-gt-america-expanded-bold text-[1.5rem]">{title2}</h2>}
        </div>

        {body && (
          <RichText
            doc={{
              type: body.doc.type,
              content: body.doc.content,
            }}
            className={{
              p: "font-gt-america-standard-light mb-6 text-base font-light text-white lg:text-white",
            }}
          />
        )}

        {/* Anchor Link */}
        {link?.href && link?.type === "anchor" && (
          <Link href={`#${link?.href}`} className="flex-start w-fit">
            <h6 className="font-gt-america-expanded-bold mt-1 text-sm">{link?.text}</h6>
            {icon?.url && (
              <Image src={icon?.url} alt={icon?.alt} width={20} height={20} unoptimized className="ml-2 w-5 h-5 inline-block" />
            )}
          </Link>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
