import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ICampaignCard } from "@/models/widgets/ICampaignCollection";
import { imageSizes } from "@/lib/image-sizes";

const CampaignCard = ({ image, name, cta, icon, counter }: ICampaignCard) => {
  return (
    <div className="campaign-card flex w-full flex-col gap-6 px-5 text-black md:w-fit md:px-0">
      <Link href={cta?.href ? cta?.href : "/"}>
        <div className="relative h-[400px] w-full md:w-[320px] lg:h-[500px] lg:w-[404px]">
          {image?.url && (
            <Image className="object-cover" src={image?.url} alt={image?.alt as string} fill sizes={imageSizes({ base: "100vw", md: "320px", lg: "404px" })} />
          )}
        </div>
      </Link>
      <Link href={cta?.href ? cta?.href : "/"}>
        <div className="flex w-full flex-col gap-2 pl-4 md:w-[320px] lg:w-[404px] lg:pl-6">
          {counter && <span className="mb-4 text-sm font-bold">{counter}</span>}
          {name && <h3 className="h3-bold font-gt-america-expanded-bold">{name}</h3>}
          {cta?.href && (
            <Button
              asChild
              className="group flex w-fit flex-row bg-transparent px-0 py-2 font-bold text-black hover:bg-transparent"
            >
              <div>
                <h5 className="h5-bold font-gt-america-expanded-bold group-hover:underline">{cta?.text}</h5>
                <span>
                  {icon?.url && (
                    <Image
                      className="group-hover:-rotate-45 w-5 h-5"
                      src={icon?.url}
                      alt={icon?.alt}
                      width={20}
                      height={20}
                      unoptimized
                    />
                  )}
                </span>
              </div>
            </Button>
          )}
        </div>
      </Link>
    </div>
  );
};
export default CampaignCard;
