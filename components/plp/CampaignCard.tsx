"use client";

import Image from "next/image";
import Link from "next/link";
import RichText from "../RichText";
import { imageSizes } from "@/lib/image-sizes";
// import { BsArrowRight } from "react-icons/bs";
import { MoveRight } from "lucide-react"

type CampaignLayout = "tile" | "wide" | "wideLarge";

type CampaignCardProps = {
  layout?: CampaignLayout;
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description: any;
  ctaLabel?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  href: string;
};

export function CampaignCard({
  layout = "tile",
  imageSrc,
  imageAlt = "",
  title,
  description,
  ctaLabel,
  className,
  href,
}: CampaignCardProps) {
  return (
    <div className={`relative flex size-full flex-col overflow-hidden ${className ?? ""}`}>
      {/* Image */}
      <div className={`${layout === "wideLarge" ? "h-[450px]" : "h-[373px]"} relative w-full shrink-0`}>
        <Image src={imageSrc} alt={imageAlt || "Campaign Image"} fill className="object-cover" sizes={imageSizes({ base: "100vw", lg: "100vw" })} />
      </div>

      {/* Campaign details */}
      <div className="min-h-[101px] content-center border-t border-b border-black bg-white p-6 lg:border-b-0">
        {layout === "tile" && (
          <div className="flex flex-col gap-4">
            <span className="font-gt-america-standard-light text-xl font-light">{title}</span>
            <Link
              href={href}
              className="font-gt-america-expanded-bold inline-flex items-center gap-2 text-sm leading-none uppercase"
            >
              {ctaLabel || "Shop Now"}
              {/* <BsArrowRight className="text-xl" /> */}
              <MoveRight className="text-xl"/>
            </Link>
          </div>
        )}
        {layout === "wide" && (
          <div className="flex items-center justify-between">
            <span className="font-gt-america-standard-light text-xl font-light">{title}</span>
            <Link
              href={href}
              className="font-gt-america-expanded-bold inline-flex items-center gap-2 text-sm leading-none uppercase"
            >
              {ctaLabel || "Shop Now"}
              {/* <BsArrowRight className="text-xl" /> */}
              <MoveRight className="text-xl"/>
            </Link>
          </div>
        )}
        {layout === "wideLarge" && (
          <div className="flex items-center justify-between">
            <div>
              <span className="font-gt-america-expanded-bold text-lg font-black uppercase">{title}</span>
              <RichText
                doc={{
                  type: description?.type,
                  content: description?.content,
                }}
                className={{
                  p: "font-gt-america-standard-light mt-2 max-w-2xl text-xl",
                }}
              />
            </div>
            <Link
              href={href}
              className="font-gt-america-expanded-bold inline-flex items-center gap-2 text-sm leading-none uppercase"
            >
              {ctaLabel || "Shop Now"}
              {/* <BsArrowRight className="text-xl" /> */}
              <MoveRight className="text-xl"/>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
