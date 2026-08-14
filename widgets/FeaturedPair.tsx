import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IFeaturedPair } from "@/models/widgets/IFeaturedPair";
import { imageSizes } from "@/lib/image-sizes";

const FeaturedPair = ({ cards, swap, variant = "default", imageSize, bgColor, pt, pb }: IFeaturedPair) => {
  const firstCard = cards?.find((card) => card?.position === "left");
  const secondCard = cards?.find((card) => card?.position === "right");
  const isBlock = variant === "block";

  if (isBlock) {
    return (
      <section>
        <div
          className={`flex flex-col gap-8 py-6 lg:pt-[var(--pt)] lg:pb-[var(--pb)] ${bgColor ? bgColor : "#FFFFFF"}`}
          style={{ "--pt": pt || "3rem", "--pb": pb || "3rem" } as React.CSSProperties}
        >
          {/* First Card - aligned left */}
          <div className="mr-auto w-full lg:w-[58.33%]">
            <div className="group flex flex-col gap-6">
              <Link href={firstCard?.link?.url ? firstCard?.link?.url : "/"}>
                <div className="relative aspect-[7/5] w-full overflow-hidden">
                  {firstCard?.image?.mobile?.url && (
                    <Image
                      className="object-cover transition-transform duration-300 group-hover:scale-105 md:hidden"
                      src={firstCard?.image?.mobile?.url}
                      alt={firstCard?.image?.mobile?.alt as string}
                      fill
                      sizes={imageSizes({ base: "100vw", lg: "50vw" })}
                    />
                  )}
                  {firstCard?.image?.desktop?.url && (
                    <Image
                      className="hidden object-cover transition-transform duration-300 group-hover:scale-105 md:block"
                      src={firstCard?.image?.desktop?.url}
                      alt={firstCard?.image?.desktop?.alt as string}
                      fill
                      sizes={imageSizes({ base: "100vw", lg: "50vw" })}
                    />
                  )}
                </div>
              </Link>
              <div className="flex flex-col gap-2 text-black md:flex-row md:items-center md:justify-between">
                {firstCard?.subtitle && (
                  <span className="font-gt-america-expanded-bold pl-8 text-[14px] font-bold uppercase">
                    {firstCard?.subtitle}
                  </span>
                )}
                {firstCard?.link?.url && (
                  <Link href={firstCard?.link?.url} className="pl-8 md:pr-8 md:pl-0">
                    <div className="flex-start font-gt-america-expanded-bold flex items-center gap-2 text-[14px] font-bold uppercase">
                      <span className="flex items-center group-hover:underline">{firstCard?.link?.text}</span>
                      {firstCard?.icon?.url && (
                        <Image
                          className="mb-[2px] w-5 h-5 transition-transform duration-300 group-hover:-rotate-45"
                          src={firstCard?.icon?.url}
                          alt={firstCard?.icon?.alt as string}
                          width={20}
                          height={20}
                          unoptimized
                        />
                      )}
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Second Card - aligned right, flush to right edge */}
          <div className="mr-8 ml-auto w-full lg:mr-0 lg:w-[58.33%]">
            <div className="group flex flex-col gap-6">
              <Link href={secondCard?.link?.url || "/"}>
                <div className="relative aspect-[7/5] w-full overflow-hidden">
                  {secondCard?.image?.mobile?.url && (
                    <Image
                      className="object-cover transition-transform duration-300 group-hover:scale-105 md:hidden"
                      src={secondCard?.image?.mobile?.url}
                      alt={secondCard?.image?.mobile?.alt as string}
                      fill
                      sizes={imageSizes({ base: "100vw", lg: "50vw" })}
                    />
                  )}
                  {secondCard?.image?.desktop?.url && (
                    <Image
                      className="hidden object-cover transition-transform duration-300 group-hover:scale-105 md:block"
                      src={secondCard?.image?.desktop?.url}
                      alt={secondCard?.image?.desktop?.alt as string}
                      fill
                      sizes={imageSizes({ base: "100vw", lg: "50vw" })}
                    />
                  )}
                </div>
              </Link>
              <div className="flex flex-col gap-2 text-black md:flex-row md:items-center md:justify-between">
                {secondCard?.subtitle && (
                  <span className="font-gt-america-expanded-bold pl-8 text-[14px] font-bold uppercase">
                    {secondCard?.subtitle}
                  </span>
                )}
                {secondCard?.link?.url && (
                  <Link href={secondCard?.link?.url} className="pl-8 md:pr-8 md:pl-0">
                    <div className="flex-start font-gt-america-expanded-bold flex items-center gap-2 text-[14px] font-bold uppercase">
                      <span className="flex items-center group-hover:underline">{secondCard?.link?.text}</span>
                      {secondCard?.icon?.url && (
                        <Image
                          className="mb-[2px] w-5 h-5 transition-transform duration-300 group-hover:-rotate-45"
                          src={secondCard?.icon?.url}
                          alt={secondCard?.icon?.alt as string}
                          width={20}
                          height={20}
                          unoptimized
                        />
                      )}
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div
        className={cn(
          "flex flex-col gap-6 px-6 pt-0 pb-6 lg:flex-row lg:gap-8 lg:px-12 lg:pt-[var(--pt)] lg:pb-[var(--pb)]",
          swap && "h-[973px] flex-col-reverse lg:flex-row-reverse",
          imageSize && "px-0 lg:justify-center lg:gap-20",
          bgColor === "#000000" && `bg-black text-white`
        )}
        style={{ "--pt": pt || "48px", "--pb": pb || "2rem" } as React.CSSProperties}
      >
        {/* First Card */}
        <div
          className={cn(!imageSize && "flex-1", imageSize && "w-full lg:[max-width:var(--card-max-w)]")}
          style={imageSize ? ({ "--card-max-w": `${imageSize.width}px` } as React.CSSProperties) : undefined}
        >
          <div className={cn("group flex size-full flex-col gap-6 lg:mb-12", swap && "justify-end lg:mt-2 lg:mb-8")}>
            {/* Image */}
            <Link href={firstCard?.link?.url || "/"}>
              <div
                className={cn(
                  "relative",
                  "overflow-hidden",
                  imageSize ? "max-h-[375px] lg:max-h-none" : "h-[310px] md:h-[384px] lg:h-[628px] 2xl:h-[600px]"
                )}
                style={imageSize ? { height: imageSize.height } : undefined}
              >
                {/* Mobile */}
                {firstCard?.image?.mobile?.url && (
                  <Image
                    className="object-cover transition-transform duration-300 hover:scale-105 md:hidden"
                    src={firstCard?.image?.mobile?.url}
                    alt={firstCard?.image?.mobile?.alt as string}
                    fill
                    sizes={imageSizes({ base: "100vw", lg: "50vw" })}
                  />
                )}

                {/* Tablet/Desktop */}
                {firstCard?.image?.desktop?.url && (
                  <Image
                    className="hidden object-cover transition-transform duration-300 hover:scale-105 md:block"
                    src={firstCard?.image?.desktop?.url}
                    alt={firstCard?.image?.desktop?.alt as string}
                    fill
                    sizes={imageSizes({ base: "100vw", lg: "50vw" })}
                  />
                )}
              </div>
            </Link>

            {/*Text Content*/}
            <div
              className={cn(
                "flex flex-col gap-2 px-8 md:flex-row md:items-center md:justify-between",
                imageSize && "px-6 lg:px-8"
              )}
            >
              {firstCard?.subtitle && (
                <span className="font-gt-america-expanded-bold text-[14px] font-bold uppercase md:order-1">
                  {firstCard?.subtitle}
                </span>
              )}
              {firstCard?.link?.url && (
                <Link href={firstCard?.link?.url} className="md:order-2">
                  <div className="flex-start font-gt-america-expanded-bold flex items-center gap-2 text-[14px] font-bold uppercase">
                    <span className="flex items-center group-hover:underline">{firstCard?.link?.text}</span>
                    {firstCard?.icon?.url && (
                      <Image
                        className="mb-[2px] w-5 h-5 transition-transform duration-300 group-hover:-rotate-45"
                        src={firstCard?.icon?.url}
                        alt={firstCard?.icon?.alt as string}
                        width={20}
                        height={20}
                        unoptimized
                      />
                    )}
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Second Card */}
        <div
          className={cn(!imageSize && "flex-1", imageSize && "w-full lg:[max-width:var(--card-max-w)]")}
          style={imageSize ? ({ "--card-max-w": `${imageSize.width}px` } as React.CSSProperties) : undefined}
        >
          <div className={cn("group flex w-full flex-col gap-6 lg:justify-end", swap && "lg:justify-start")}>
            {/*Image*/}
            <Link href={secondCard?.link?.url || "/"}>
              <div
                className={cn(
                  "relative",
                  "overflow-hidden",
                  imageSize
                    ? "max-h-[375px] lg:max-h-none"
                    : "mt-[50px] h-[310px] md:h-[384px] lg:h-[628px] 2xl:h-[600px]"
                )}
                style={imageSize ? { height: imageSize.height } : undefined}
              >
                {secondCard?.image?.desktop?.url && (
                  <Image
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    src={secondCard?.image?.desktop?.url}
                    alt={secondCard?.image?.desktop?.alt as string}
                    fill
                    sizes={imageSizes({ base: "100vw", lg: "50vw" })}
                  />
                )}
              </div>
            </Link>

            {/* Text Content */}
            <div
              className={cn(
                "flex flex-col gap-2 px-8 md:flex-row md:items-center md:justify-between",
                imageSize && "px-6 lg:px-8"
              )}
            >
              {secondCard?.subtitle && (
                <span className="font-gt-america-expanded-bold text-[14px] font-bold uppercase md:order-1">
                  {secondCard?.subtitle}
                </span>
              )}
              {secondCard?.link?.url && (
                <Link href={secondCard?.link?.url} className="md:order-2">
                  <div className="flex-start font-gt-america-expanded-bold flex items-center gap-2 text-[14px] font-bold uppercase">
                    <span className="flex items-center group-hover:underline">{secondCard?.link?.text}</span>
                    {secondCard?.icon?.url && (
                      <Image
                        className="mb-[2px] w-5 h-5 transition-transform duration-300 group-hover:-rotate-45"
                        src={secondCard?.icon?.url}
                        alt={secondCard?.icon?.alt as string}
                        width={20}
                        height={20}
                        unoptimized
                      />
                    )}
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FeaturedPair;
