import Image from "next/image";
import React from "react";
import { IProductCard } from "@/models/widgets/IProductCard";
import RichText from "@/components/RichText";
import { imageSizes } from "@/lib/image-sizes";

const ProductCard = ({ images, tags, description }: IProductCard) => {
  return (
    <div className="relative hidden lg:flex">
      {/* Images Section */}
      <div className="relative flex-1">
        <div
          className={`relative flex h-[calc(100vh-3.75rem)] w-full items-center justify-center p-6 md:p-12 lg:w-[50vw] lg:p-24 ${images[0]?.url ? "bg-[#efe6d7]" : ""} `}
        >
          {images[0]?.url && (
            <Image
              src={images[0]?.url}
              alt={images[0]?.alt}
              fill
              sizes={imageSizes({ base: "100vw", lg: "50vw" })}
              className="!relative !h-auto object-contain"
            />
          )}
        </div>
        <div
          className={`relative flex h-[calc(100vh-3.75rem)] w-full items-center justify-center p-6 md:p-12 lg:w-[50vw] lg:p-24 ${images[1]?.url ? "bg-[#f0ebe4]" : ""} `}
        >
          {images[1]?.url && (
            <Image
              src={images[1]?.url}
              alt={images[1]?.alt}
              fill
              sizes={imageSizes({ base: "100vw", lg: "50vw" })}
              className="!relative !h-auto object-contain"
            />
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="sticky top-[0] flex h-[100vh] flex-1 flex-col justify-center gap-4 bg-[#f7f2ea] px-6 py-0 md:gap-6 md:px-12 lg:gap-8 lg:px-24">
        {!!tags?.length && (
          <ul className="flex list-none flex-wrap gap-2">
            {tags?.map(({ tag, icon }) => (
              <li
                key={tag}
                className="flex items-center justify-center rounded-full bg-[#f2eadf] px-3 py-1 text-xs leading-[14px] font-normal text-[var(--dark-green)] capitalize md:px-4 md:py-2 md:text-[13px]"
              >
                {icon?.url && (
                  <Image src={icon?.url} width={18} height={12} alt={icon?.alt}  className="mr-1" />
                )}
                {tag}
              </li>
            ))}
          </ul>
        )}

        {description && (
          <div className="text-sm leading-6 font-normal text-[var(--dark-green)] md:text-base md:leading-7">
            <RichText
              doc={{
                type: description.doc.type,
                content: description.doc.content,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
