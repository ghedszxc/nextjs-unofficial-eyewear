"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import * as React from "react";
import { Button } from "../ui/button";
import breakpoints from "@/constants/breakpoints";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { imageSizes } from "@/lib/image-sizes";

type ImageItem = {
  src: string;
  alt: string;
};

type ProductInfo = {
  productCode: string;
  productLabels?: string[];
};

function CarouselArrows({
  api,
  canScrollPrev,
  canScrollNext,
  className,
}: {
  api: CarouselApi | null;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full items-center justify-between", className)}>
      <Button
        onClick={() => api?.scrollPrev()}
        aria-label="Previous"
        disabled={!canScrollPrev}
        className="h-8 w-8 cursor-pointer justify-start bg-transparent p-0! hover:bg-transparent disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Image src="/icons/chevron-left.svg" alt="Previous" width={16.31} height={30.96} unoptimized />
      </Button>
      <Button
        onClick={() => api?.scrollNext()}
        aria-label="Next"
        disabled={!canScrollNext}
        className="h-8 w-8 cursor-pointer justify-end bg-transparent p-0! hover:bg-transparent disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Image src="/icons/chevron-right.svg" alt="Next" width={16.31} height={30.96} unoptimized />
      </Button>
    </div>
  );
}

export function ProductGallery({
  images,
  productInfo,
  previewImage,
}: {
  images: ImageItem[];
  productInfo: ProductInfo;
  previewImage?: ImageItem;
}) {
  const reversedImages = [...images].reverse();
 
  const displayedImages = previewImage ? [previewImage, ...reversedImages.slice(1)] : reversedImages;
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const { current } = useBreakpoint(breakpoints);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  // const goTo = (index: number) => api?.scrollTo(index);

  return (
    <div className="relative flex size-full flex-col">
      {current === "mobile" || current === "tablet" ? (
        <div className="flex w-full flex-col gap-2 p-6">
          <span className="font-gt-america-expanded-bold text-sm">{productInfo.productCode}</span>
          <div className="font-gt-america-standard-light flex gap-12 text-base">
            {productInfo.productLabels?.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
        </div>
      ) : null}
      <Carousel
        setApi={setApi}
        opts={{ duration: 20, loop: true }}
        className="inset-0 block h-full w-full lg:absolute"
      >
        <CarouselContent className="relative ml-0 h-full">
          {displayedImages.map((img, index) => (
            <CarouselItem key={index} className="relative h-full pl-0">
              <div className="relative flex min-h-[375px] w-full items-center justify-center lg:min-h-[720px]">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={index === 0}
                  sizes={imageSizes({ base: "100vw", lg: "50vw" })}
                  className="top-auto! object-contain! md:left-1/2! md:-translate-x-1/2! lg:top-1/2! lg:left-1/2! lg:max-h-[720px] lg:translate-x-[-40%] lg:-translate-y-1/2 lg:object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselArrows
          api={api}
          canScrollPrev={canScrollPrev}
          canScrollNext={canScrollNext}
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 transform px-6 lg:hidden"
        />
      </Carousel>

      {current === "laptop" || current === "desktop" ? (
        <div className="flex h-full flex-col justify-between p-8">
          <div className="z-10 flex w-full flex-col gap-2">
            <div className="flex h-[18px]!">
              <span className="font-gt-america-expanded-bold text-sm">{productInfo.productCode}</span>
            </div>
            <div className="font-gt-america-standard-light flex gap-12 text-base">
              {productInfo.productLabels?.map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </div>
          </div>

          <CarouselArrows api={api} canScrollPrev={canScrollPrev} canScrollNext={canScrollNext} className="z-10" />
        </div>
      ) : null}
    </div>
  );
}
