// components/plp/TileBanner.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { CampaignBanner } from "@/adapter/PLP/adapter";
import { imageSizes } from "@/lib/image-sizes";
import { Button } from "../ui/button";

type Props = {
  banner: CampaignBanner;
  variant: "single" | "half-width";
};

const TileBanner = ({ banner, variant }: Props) => {
  const { desktopImage, mobileImage, title, description, cta, backgroundColor, side } = banner;
  // half-width tiles sit beside product cards in the same grid row, so they stretch to the
  // row height; the single variant keeps its own portrait aspect.
  const sizing = variant === "single" ? "aspect-[1/1.4] h-[490px] lg:h-[519px]" : "h-full min-h-[474px]";

  // Fallback: use desktop image for both if mobile image is missing
  const mobileSrc = mobileImage?.url || desktopImage?.url;
  const mobileAlt = mobileImage?.alt || desktopImage?.alt || "Banner";
  const desktopSrc = desktopImage?.url;
  const desktopAlt = desktopImage?.alt || "Banner";

  return (
    <div className={`relative flex w-full flex-col overflow-hidden ${sizing}`}>
      {/* Image */}
      <div className={`relative min-h-0 w-full flex-1 border-b border-black ${side === "left" ? "lg:border-r" : ""}`}>
        {mobileSrc && (
          <Image className="object-cover lg:hidden" src={mobileSrc} alt={mobileAlt} fill sizes={imageSizes({ base: "100vw", lg: "50vw" })} />
        )}
        {desktopSrc && (
          <Image className="hidden object-cover lg:block" src={desktopSrc} alt={desktopAlt} fill sizes={imageSizes({ base: "100vw", lg: "50vw" })} />
        )}
      </div>

      {/* Content */}
      <div
        className={`flex min-h-[101px]! shrink-0 flex-col justify-between gap-2 border-b border-black bg-white px-8 py-6 text-black lg:flex-row lg:items-center lg:gap-0 ${side === "left" ? "lg:border-r" : ""}`}
        style={{ backgroundColor: backgroundColor }}
      >
        <div className="flex place-items-center">
          {title && <h3 className="font-gt-america-standard-regular text-base lg:text-xl">{title}</h3>}
        </div>
        {cta?.label && (
          <Button
            variant={null}
            asChild
            className="font-gt-america-expanded-bold flex h-5 w-fit p-0 text-sm text-black uppercase hover:underline"
          >
            <Link href={cta.url}>
              <span className="mt-1 flex place-items-center">{cta.label}</span>
              <Image src="/icons/arrow-right-2.svg" alt="" width={20} height={20} aria-hidden="true" className="h-5 w-5 shrink-0" unoptimized/>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TileBanner;
