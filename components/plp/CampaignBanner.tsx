'use client';

import Image from "next/image";
import Link from "next/link";
import RichText from "../RichText";
import { Button } from "../ui/button";
import { CampaignBanner } from "@/adapter/PLP/adapter";
import { imageSizes } from "@/lib/image-sizes";

type CampaignBannerCardProps = {
  banner: CampaignBanner;
};

const CampaignBannerCard = ({ banner }: CampaignBannerCardProps) => {
  const { layout, desktopImage, mobileImage, title, description, cta, backgroundColor, reversed, side } = banner;
  const isRight = layout === "split" && side === "right";
  const bgColor = backgroundColor?.toLowerCase() || "";
  const isDark = bgColor.includes("#3a3a2c") || bgColor.includes("#c6a28d");
  
  // Fallback: use desktop image for both if mobile image is missing
  const mobileSrc = mobileImage?.url || desktopImage?.url;
  const mobileAlt = mobileImage?.alt || desktopImage?.alt || "Banner";
  const desktopSrc = desktopImage?.url;
  const desktopAlt = desktopImage?.alt || "Banner";

  return (
    <div
      className={`flex ${reversed ? "flex-col-reverse" : "flex-col"} ${isRight ? "lg:flex-row-reverse" : "lg:flex-row"} overflow-hidden lg:gap-2 lg:h-[490px]`}
    >
      {/* Image */}
      <div className="relative h-[375px] w-full lg:h-full lg:w-1/2">
        {mobileSrc && (
          <Image
            className="object-cover lg:hidden"
            src={mobileSrc}
            alt={mobileAlt}
            fill
            sizes={imageSizes({ base: "100vw", lg: "50vw" })}
            
          />
        )}
        {desktopSrc && (
          <Image
            className="hidden object-cover lg:block"
            src={desktopSrc}
            alt={desktopAlt}
            fill
            sizes={imageSizes({ base: "100vw", lg: "50vw" })}
            
          />
        )}
      </div>

      {/* Content */}
      <div
        className={`flex h-full w-full flex-col justify-between gap-12 p-6 pr-12 lg:w-1/2 lg:gap-0 lg:p-8 ${isDark ? "text-white" : "text-black"}`}
        style={{ backgroundColor: backgroundColor }}
      >
        <div className="flex h-full">
          <div className="flex flex-col gap-2">
            {title && <h3 className="font-matter-regular text-2xl">{title}</h3>}
            {description && <RichText doc={description.doc} className={{ p: "font-matter-regular text-sm" }} />}
          </div>
        </div>

        <div className="-mr-[19px] lg:mr-0">
          {cta?.url && (
            // Single CTA
            <Button
              asChild
              className={`flex h-[43px] w-full items-center rounded-none border ${isDark ? "border-white" : "border-black"} bg-transparent px-4 py-2 hover:bg-[#F7F2EA66] lg:w-fit`}
            >
              <Link href={cta.url}>
                <span className={`font-matter-regular text-lg ${isDark ? "text-white" : "text-black"}`}>{cta.label}</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignBannerCard;
