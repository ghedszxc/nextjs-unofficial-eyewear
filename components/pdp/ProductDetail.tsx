"use client";

import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import { ProductGallery } from "./ProductGallery";
import { ProductVariants } from "./ProductVariants";
import { ProductTabs } from "./ProductTabs";
import {
  GALLERY_SECTION_CLASSES,
  INFO_SECTION_CLASSES,
  PRODUCT_CODE_CLASSES,
  CTA_BUTTON_CLASSES,
  HEADER_CONTAINER_CLASSES,
  MAIN_GRID_CLASSES,
  FLEX_ORDER_CLASSES,
  FLEX_FULL_BETWEEN_CLASSES,
} from "./constants";
import Link from "next/link";
import { useCTARef } from "@/hooks/useCTARef";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { extractVariantDisplayData } from "./useProductData";

const HOVER_SWITCH_DELAY = 300;

export default function ProductDetail({ productData }: { productData: any }) {
  const { productTitle, productDescription, productImages, productInfo, productDetails, productAttributes, productFrameColor, productVariants, productCare } = productData;
  const ctaRef = useCTARef();

  const [hoveredVariant, setHoveredVariant] = useState<any | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHoverVariant = useCallback((variant: any | null) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setHoveredVariant(variant), HOVER_SWITCH_DELAY);
  }, []);

  useEffect(() => () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  }, []);

  const display = useMemo(() => {
    if (hoveredVariant) return extractVariantDisplayData(hoveredVariant);
    return { productTitle, productInfo, productImages, productFrameColor };
  }, [hoveredVariant, productTitle, productInfo, productImages, productFrameColor]);

  const previewImage = useMemo(() => {
    if (!hoveredVariant) return undefined;
    return [...display.productImages].reverse()[0];
  }, [hoveredVariant, display.productImages]);

  return (
    <main>
      <div className={HEADER_CONTAINER_CLASSES}>
        <BackButton />
      </div>

      <div className={MAIN_GRID_CLASSES}>
        {/* Gallery Section */}
        <section className={GALLERY_SECTION_CLASSES}>
          <ProductGallery images={productImages} productInfo={display.productInfo} previewImage={previewImage} />
        </section>

        {/* Info Section */}
        <section className={INFO_SECTION_CLASSES}>
          {/* Product Code */}
          <div className={FLEX_ORDER_CLASSES}>
            <p className={PRODUCT_CODE_CLASSES}>{display.productTitle}</p>
          </div>

          {/* Product Variants */}
          <ProductVariants
            activeImage={productImages?.[1]}
            activeAttributes={productAttributes}
            variants={productVariants}
            label={display.productFrameColor}
            onHoverVariant={handleHoverVariant}
          />

          {/* Tabs and CTA */}
          <div className={FLEX_FULL_BETWEEN_CLASSES}>
            <ProductTabs description={productDescription} details={productDetails} care={productCare} />

            {/* Find Where to Buy Button */}
            <div ref={ctaRef}>
              <Button asChild variant="ghost" className={CTA_BUTTON_CLASSES}>
                <Link href={`/storelist`} className="font-gt-america-expanded-bold cursor-pointer uppercase">
                  Find where to buy
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
