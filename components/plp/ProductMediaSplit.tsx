"use client";

import { imageSizes } from "@/lib/image-sizes";
import { cn } from "@/lib/utils";
import Image from "next/image";
import * as React from "react";

type Side = "left" | "right";

type Media =
  | {
      type: "image";
      src: string;
      alt: string;
      priority?: boolean;
    }
  | {
      type: "video";
      src: string;
      poster?: string;
      autoPlay?: boolean;
      muted?: boolean;
      loop?: boolean;
      controls?: boolean;
    }
  | {
      // handy for CMS blocks / placeholders
      type: "custom";
      node: React.ReactNode;
    };

type ProductMediaSplitProps = {
  /** Which side should the product render be on? */
  productSide?: Side;

  /** Left block: large image/video */
  media: Media;

  /** Right block: product render image (or custom node) */
  productRender?: {
    imageSrc?: string;
    alt?: string;
    node?: React.ReactNode; // if provided, overrides image
  };

  /** Small text under the product render (label + name) */
  productMeta?: {
    label?: string;
    name?: string;
  };

  /** Caption below the LARGE media area (like your mock) */
  caption?: React.ReactNode;

  /** Layout tweaks */
  className?: string;
  containerClassName?: string;

  /** Aspect ratios (Tailwind arbitrary aspect values) */
  mediaAspectClassName?: string; // e.g. "aspect-[21/12]"
  productAspectClassName?: string; // e.g. "aspect-[3/4]"
};

export function ProductMediaSplit({
  productSide = "right",
  media,
  productRender,
  productMeta,
  caption,
  className,
  containerClassName,
  mediaAspectClassName = "aspect-[21/12]",
  productAspectClassName = "aspect-[3/4]",
}: ProductMediaSplitProps) {
  const ProductBlock = (
    <article className="w-full">
      <div className={cn("w-full bg-neutral-500/30", productAspectClassName)}>
        {productRender?.node ? (
          <div className="h-full w-full">{productRender.node}</div>
        ) : productRender?.imageSrc ? (
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={productRender.imageSrc}
              alt={productRender.alt ?? "Product render"}
              fill
              className="object-cover"
              sizes={imageSizes({ base: "100vw", lg: "320px" })}
              
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm text-neutral-900">Product render</span>
          </div>
        )}
      </div>

      {(productMeta?.label || productMeta?.name) && (
        <div className="mt-6 space-y-1">
          {productMeta?.label && <p className="text-xs text-neutral-800">{productMeta.label}</p>}
          {productMeta?.name && <p className="text-sm font-medium text-neutral-900">{productMeta.name}</p>}
        </div>
      )}
    </article>
  );

  const MediaBlock = (
    <div className="w-full">
      <div className={cn("relative w-full overflow-hidden bg-neutral-200", mediaAspectClassName)}>
        {media.type === "image" && (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            className="object-cover"
            sizes={imageSizes({ base: "100vw", lg: "70vw" })}
            priority={media.priority}
            
          />
        )}

        {media.type === "video" && (
          <video
            className="h-full w-full object-cover"
            src={media.src}
            poster={media.poster}
            autoPlay={media.autoPlay}
            muted={media.muted ?? true}
            loop={media.loop}
            controls={media.controls}
            playsInline
          />
        )}

        {media.type === "custom" && <div className="absolute inset-0">{media.node}</div>}

        {/* Placeholder label if you want it when not using image/video */}
        {media.type === "custom" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-neutral-900">Image/video</span>
          </div>
        )}
      </div>

      {caption && <div className="mt-5 text-sm leading-6 text-neutral-900">{caption}</div>}
    </div>
  );

  const isProductLeft = productSide === "left";

  return (
    <section className={cn("w-full bg-neutral-300 px-6 py-10", className)}>
      <div className={cn("mx-auto max-w-6xl", containerClassName)}>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          {isProductLeft ? (
            <>
              {/* swap order on desktop */}
              <div className="lg:order-2">{MediaBlock}</div>
              <div className="lg:order-1">{ProductBlock}</div>
            </>
          ) : (
            <>
              <div>{MediaBlock}</div>
              <div>{ProductBlock}</div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
