import Image from "next/image";
import Link from "next/link";
import RichText from "../RichText";
import { Button } from "../ui/button";
import { imageSizes } from "@/lib/image-sizes";
// import { BsArrowRight } from "react-icons/bs";
import { MoveRight } from "lucide-react"

type SplitCampaignCardProps = {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description: any;
  ctaLabel?: string;
  href: string;
};

export function SplitCampaignCard({
  imageSrc,
  imageAlt = "",
  title,
  description,
  ctaLabel,
  href,
}: SplitCampaignCardProps) {
  return (
    <div className="grid size-full grid-rows-[450px_1fr] overflow-hidden lg:grid-cols-12 lg:grid-rows-none">
      {/* Left: Image */}
      <div className="relative col-span-6">
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes={imageSizes({ base: "100vw", lg: "50vw" })}  />
      </div>

      {/* Right: Content panel */}
      <div className="col-span-6 text-black">
        <div className="flex h-full flex-col gap-4 border-t border-black p-6 lg:gap-0 lg:border-t-0">
          {/* Top copy */}
          <div className="flex flex-col gap-2">
            <h3 className="font-gt-america-expanded-bold text-lg uppercase">{title}</h3>
            <RichText
              doc={{
                type: description?.type,
                content: description?.content,
              }}
              className={{
                p: "font-gt-america-standard-light text-xl text-black/90",
              }}
            />
          </div>

          {/* Spacer */}
          <div className="hidden lg:flex-1" />

          {/* CTA */}
          <Link
            href={href}
            className="font-gt-america-expanded-bold inline-flex items-center gap-2 text-sm leading-none uppercase lg:mt-0"
          >
            {ctaLabel || "Shop Now"}
            {/* <BsArrowRight className="text-xl" /> */}
            <MoveRight className="text-xl"/>
          </Link>
        </div>
      </div>
    </div>
  );
}
