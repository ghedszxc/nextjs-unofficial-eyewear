"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { imageSizes } from "@/lib/image-sizes";
import { cn } from "@/lib/utils";
import Image from "next/image";

type ProductCard = {
  id: string;
  label: string;
  name: string;
  slides: { src: string; alt: string }[];
};

const products: ProductCard[] = [
  {
    id: "p1",
    label: "label/ label",
    name: "Product name",
    slides: [
      { src: "https://picsum.photos/seed/a/1200/1200", alt: "Lifestyle/On model" },
      { src: "https://picsum.photos/seed/b/1200/1200", alt: "Lifestyle/On model" },
      { src: "https://picsum.photos/seed/c/1200/1200", alt: "Lifestyle/On model" },
    ],
  },
  {
    id: "p2",
    label: "label/ label",
    name: "Product name",
    slides: [
      { src: "https://picsum.photos/seed/d/1200/1200", alt: "Lifestyle/On model" },
      { src: "https://picsum.photos/seed/e/1200/1200", alt: "Lifestyle/On model" },
      { src: "https://picsum.photos/seed/f/1200/1200", alt: "Lifestyle/On model" },
    ],
  },
  {
    id: "p3",
    label: "label/ label",
    name: "Product name",
    slides: [
      { src: "https://picsum.photos/seed/g/1200/1200", alt: "Lifestyle/On model" },
      { src: "https://picsum.photos/seed/h/1200/1200", alt: "Lifestyle/On model" },
      { src: "https://picsum.photos/seed/i/1200/1200", alt: "Lifestyle/On model" },
    ],
  },
];

export default function ProductGridWithCarousels() {
  return (
    <section className="w-full bg-neutral-300 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-3">
          {products.map((p) => (
            <article key={p.id} className="w-full">
              <Carousel opts={{ loop: true }} className="w-full">
                <div className="relative">
                  {/* Square media area */}
                  <CarouselContent className="-ml-0">
                    {p.slides.map((s, idx) => (
                      <CarouselItem key={idx} className="pl-0">
                        <div className="relative aspect-square w-full overflow-hidden bg-neutral-200">
                          <Image
                            src={s.src}
                            alt={s.alt}
                            fill
                            className="object-cover"
                            sizes={imageSizes({ base: "100vw", md: "33vw" })}
                            priority={idx === 0}
                          />

                          {/* Center overlay label */}
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <span className="bg-neutral-300/60 px-3 py-1 text-sm text-neutral-900">
                              Lifestyle/On model
                            </span>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* Overlay arrows (mid-left / mid-right) */}
                  <CarouselPrevious
                    className={cn(
                      "absolute top-1/2 left-3 -translate-y-1/2",
                      "h-9 w-9 rounded-full border-none bg-transparent shadow-none",
                      "text-neutral-900 hover:bg-neutral-300/60"
                    )}
                  />
                  <CarouselNext
                    className={cn(
                      "absolute top-1/2 right-3 -translate-y-1/2",
                      "h-9 w-9 rounded-full border-none bg-transparent shadow-none",
                      "text-neutral-900 hover:bg-neutral-300/60"
                    )}
                  />
                </div>
              </Carousel>

              {/* Text under media */}
              <div className="mt-6 space-y-1">
                <p className="text-xs text-neutral-800">{p.label}</p>
                <p className="text-sm font-medium text-neutral-900">{p.name}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
