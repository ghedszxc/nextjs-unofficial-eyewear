import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ICenterImage } from "@/models/widgets/ICenterImage";
import { imageSizes } from "@/lib/image-sizes";

const CenterImage = ({ image, link, text, icon }: ICenterImage) => {
  return (
    <section>
      <div className="lg:flex-center p-6 lg:p-8">
        <div className="flex flex-col gap-6">
          <div className="relative h-[310px] w-full md:h-[384] lg:h-[676px] lg:w-[792px]">
            {image?.url && (
              <Image src={image?.url} alt={image?.alt as string} fill sizes={imageSizes({ base: "100vw", lg: "792px" })} className="object-cover" />
            )}
          </div>
          <div className="flex flex-col gap-2 lg:px-6">
            {link?.url && (
              <Link href={link?.url}>
                <h3 className="font-gt-america-expanded-bold h3-bold">
                  {link.text}
                  <span>
                    {icon?.url && (
                      <Image
                        src={icon?.url}
                        alt={icon?.alt}
                        width={16}
                        height={16}
                        unoptimized
                        className="ml-1 inline-block pb-[3px]"
                      />
                    )}
                  </span>
                </h3>
              </Link>
            )}
            {text && <h6 className="h6-bold font-gt-america-expanded-bold">{text}</h6>}
          </div>
        </div>
      </div>
    </section>
  );
};
export default CenterImage;
