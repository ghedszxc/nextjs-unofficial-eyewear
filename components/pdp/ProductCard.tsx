"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { imageSizes } from "@/lib/image-sizes";

type ProductImage = { src: string; alt?: string };

export type ProductCardProduct = {
  name: string;
  // gender: string;
  status?: string;
  age_group?: string | null;
  polarized?: boolean;
  productType?: string;
  images: ProductImage[]; // allows multiple images per color if you want later
};

export type ProductCardProps = {
  products: ProductCardProduct[];
  className?: string;
  isLastIndex?: boolean; // for styling the last card in the "You May Also Like" section
  category?: string;
};

function normalizeProducts(props: ProductCardProps): ProductCardProduct[] {
  if ("products" in props && props.products?.length) return props.products;
  return [];
}

export function ProductCard(props: ProductCardProps) {
  const products = useMemo(() => normalizeProducts(props), [props]);
  const category = "products";

  const totalColors = products.length;

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!api) return;

    setIndex(api.selectedScrollSnap());

    const onSelect = () => {
      const newIndex = api.selectedScrollSnap();
      setIndex(newIndex);
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const active = products[index] ?? products[0];

  return (
    <div
      className={`bg-secondary-light flex size-full flex-col justify-between border-y border-l border-black ${
        props.className ?? ""
      } ${props.isLastIndex ? "border-r" : ""}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Carousel setApi={setApi} className="flex h-auto flex-col justify-between py-6 lg:px-4 lg:py-10">
        <CarouselContent className="h-full">
          {products.map((p, i) => {
            const angledImage = p.images?.[1];
            const frontImage = p.images?.[0];
            const slug = p?.name?.replace(" ", "-").toLowerCase();
            const type = p.productType?.toLowerCase().replace(/\s+/g, "-").replace(/,/g, "") ?? "";

            return (
              <CarouselItem key={`${p.name}-${i}`} className="h-full">
                <Link href={`/${category}/${type}/${slug}`}>
                  <div className="flex h-[9999px] max-h-[177px] w-full items-center justify-center lg:max-h-[261px]">
                    <div className="relative size-full">
                      {angledImage?.src ? (
                        <>
                          <Image
                            src={angledImage.src}
                            alt={angledImage.alt ?? p.name}
                            fill
                            sizes={imageSizes({ base: "50vw", md: "33vw", lg: "25vw" })}
                            className={`object-contain transition-opacity duration-300 ${
                              isHovering ? "opacity-0" : "opacity-100"
                            }`}
                            
                          />
                          {frontImage?.src && (
                            <Image
                              src={frontImage.src}
                              alt={frontImage.alt ?? p.name}
                              fill
                              sizes={imageSizes({ base: "50vw", md: "33vw", lg: "25vw" })}
                              className={`object-contain transition-opacity duration-300 ${
                                isHovering ? "opacity-100" : "opacity-0"
                              }`}
                              
                            />
                          )}
                        </>
                      ) : (
                        <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
                          No image
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <div className="items-center transition-opacity duration-300 lg:grid lg:grid-cols-3">
          <div className={`justify-self-start ${isHovering ? "lg:opacity-100" : "lg:opacity-0"}`}>
            {totalColors > 1 ? (
              <CarouselPrevious
                className="static hidden translate-x-0 translate-y-0 cursor-pointer bg-transparent shadow-none disabled:opacity-10 lg:block"
                aria-label="Previous color"
                variant={null}
              />
            ) : null}
          </div>
          <div
            className={`font-gt-america-standard-light justify-self-center text-[8px] lg:text-base ${totalColors > 1 ? "opacity-100" : "opacity-0"}`}
          >
            {totalColors > 0 && `${index + 1} / ${totalColors} Color${totalColors > 1 ? "s" : ""}`}
          </div>
          <div className={`justify-self-end ${isHovering ? "lg:opacity-100" : "lg:opacity-0"}`}>
            {totalColors > 1 ? (
              <CarouselNext
                className="static hidden translate-x-0 translate-y-0 cursor-pointer bg-transparent shadow-none disabled:opacity-10 lg:block"
                aria-label="Next color"
                variant={null}
              />
            ) : null}
          </div>
        </div>
      </Carousel>

      <div className="flex flex-col gap-2 border-t border-black p-4 lg:gap-4 lg:p-6">
        <p className="font-gt-america-expanded-bold text-xs lg:text-base">{active?.name ?? ""}</p>
        <div className="flex justify-between lg:uppercase">
          <p className="font-gt-america-standard-light lg:font-gt-america-expanded-bold text-xs lg:text-xs">
            {(() => {
              if (active?.status) return active.status;
              if (active?.age_group) return active.age_group;
              return active?.polarized ? "Polarized" : "";
            })()}
          </p>
          <p className="font-gt-america-standard-light lg:font-gt-america-expanded-bold text-xs lg:text-xs">
            {(() => {
              const hasStatus = !!active?.status;
              if (hasStatus && active?.age_group) return active.age_group;
              if (hasStatus) return active?.polarized ? "Polarized" : "";
              if (active?.age_group && active?.polarized) return "Polarized";
              return "";
            })()}
          </p>
        </div>
      </div>
    </div>
  );
}
