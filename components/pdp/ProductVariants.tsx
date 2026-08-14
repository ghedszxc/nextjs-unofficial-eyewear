/**
 * ProductVariants Component
 * Displays available color variants as a horizontal scrollable gallery
 */

"use client";

import { getStoryblokRoot } from "@/constants/storyblok";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ACTIVE_VARIANT_IMAGE_CLASSES, FRAME_COLOR_CONTAINER_CLASSES, FRAME_COLOR_LABEL_CLASSES, VARIANT_IMAGE_CLASSES } from "./constants";
import { safeJsonParse } from "@/lib/utils";

interface Variant {
  name: string;
  full_slug: string;
  content: {
    media: Array<{
      filename: string;
      alt: string;
    }>;
    local_settings?: {
      code: string; // JSON string containing attributes like AGE_GROUP, POLARIZED, FRONT_FRAME_COLOR, etc.
    };
  };
}

interface ProductImage {
  src: string;
  alt: string;
}

interface ActiveAttributes {
  FRONT_FRAME_COLOR?: string;
  FRAME_MATERIAL?: string;
  LENS_TYPE?: string;
  LENS_COLOR_DESCRIPTION?: string;
}

interface ProductVariantsProps {
  activeImage: ProductImage;
  activeAttributes?: ActiveAttributes;
  variants: Variant[];
  label?: string;
  onHoverVariant?: (variant: Variant | null) => void;
}

function getVariantSideImage(variant: Variant) {
  return variant?.content?.media?.find((media) => media?.alt === "Product Side Snapshot");
}

export function ProductVariants({ activeImage, activeAttributes, variants, label = "Frame color", onHoverVariant }: ProductVariantsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!activeImage) return null;

  const toDisplayValue = (v: string | undefined) =>
    v && v.toLowerCase() !== "undefined" && v.toLowerCase() !== "not defined" ? v : "Clear";

  const activeTooltipText = [
    activeAttributes?.FRONT_FRAME_COLOR,
    activeAttributes?.FRAME_MATERIAL,
    activeAttributes?.LENS_TYPE,
    activeAttributes?.LENS_COLOR_DESCRIPTION,
  ].map(toDisplayValue).join(" - ");

  return (
    <div className="flex flex-col gap-2">
      <p className={FRAME_COLOR_LABEL_CLASSES}>{label}</p>
      <div className={FRAME_COLOR_CONTAINER_CLASSES}>
        {/* Active Variant Image */}
        <div
          className={ACTIVE_VARIANT_IMAGE_CLASSES}
          onMouseEnter={() => activeTooltipText && setHoveredId("__active__")}
          onMouseLeave={() => setHoveredId(null)}
        >
          <Image src={activeImage.src} alt={activeImage.alt} fill sizes="72px" className="object-contain"/>
          {hoveredId === "__active__" && (
            <span className="pointer-events-none absolute top-full left-[30px] mt-1 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white hidden lg:block">
              {activeTooltipText}
            </span>
          )}
        </div>

        {/* Variant Links */}
        {variants?.length >= 1 &&
          variants.map((variant) => {
            const variantImage = getVariantSideImage(variant);
            const variantSlug = variant?.full_slug.split("/").pop() ?? "";
            const variantAttributes = variant?.content?.local_settings
              ? safeJsonParse(variant.content.local_settings.code)
              : {};
            const variantType =
              variantAttributes?.COLLECTION?.trim() ||
              variantAttributes?.CAMPAIGN_FOOTER_SELECTION?.trim() ||
              variantAttributes?.LENS_TYPE?.trim();
            const type = variantType ? variantType.toLowerCase().replace(/\s+/g, "-").replace(/,/g, "") : null;
            const variantUrl = `/products/${type}/${variantSlug}`;

            const tooltipText = [
              variantAttributes?.FRONT_FRAME_COLOR,
              variantAttributes?.FRAME_MATERIAL,
              variantAttributes?.LENS_TYPE,
              variantAttributes?.LENS_COLOR_DESCRIPTION,
            ].map(toDisplayValue).join(" - ");

            if (!variantImage) return null;

            return (
              <Link
                href={variantUrl}
                key={variant.name}
                className={VARIANT_IMAGE_CLASSES}
                onMouseEnter={() => {
                  onHoverVariant?.(variant);
                  if (tooltipText) setHoveredId(variant.name);
                }}
                onMouseLeave={() => {
                  onHoverVariant?.(null);
                  setHoveredId(null);
                }}
              >
                <Image
                  src={variantImage.filename}
                  alt={variantImage.alt}
                  fill
                  sizes="72px"
                  className="object-contain"
                />
                {hoveredId === variant.name && (
                  <span className="pointer-events-none absolute top-full left-[30px] mt-1 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white hidden lg:block">
                    {tooltipText}
                  </span>
                )}
              </Link>
            );
          })}
      </div>
    </div>
  );
}
