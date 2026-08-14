"use client";

import { useProductData } from "./useProductData";
import { Button } from "../ui/button";
import Link from "next/link";
import { useScroll } from "@/hooks/useScroll";
import breakpoints from "@/constants/breakpoints";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useFooterVisibility } from "@/lib/contexts/FooterContext";
import { useCTAVisibility } from "@/lib/contexts/CTAVisibilityContext";

const StickyBottom = ({ pdpData, productId }: { pdpData: any[]; productId: string }) => {
  // Extract product data using the hook
  const { productCode, productAttributes } = useProductData(pdpData, productId);
  const productColor = productAttributes?.FRONT_FRAME_COLOR;

  const { scrollY } = useScroll();
  const { current } = useBreakpoint(breakpoints);
  const { isFooterVisible } = useFooterVisibility();
  const { isCTAVisible } = useCTAVisibility();
  const isMobile = current === "mobile" || current === "tablet";

  const isSticky = isMobile
    ? scrollY > 0 && !isFooterVisible && !isCTAVisible
    : scrollY > 820 && !isFooterVisible;

  return (
    <div
      className={`fixed bottom-0 z-100 flex w-full flex-row items-center justify-between bg-black p-6 text-white lg:z-0 lg:px-8 lg:py-6 ${isSticky ? "translate-y-0 duration-500" : "translate-y-full duration-150"}`}
    >
      <div className="hidden lg:flex lg:flex-row lg:gap-12">
        <span className="font-gt-america-expanded-bold text-lg uppercase">{productCode}</span>
        <p className="font-gt-america-standard-light text-base font-light">{productColor}</p>
      </div>
      <Button
        asChild
        className="flex w-full items-center rounded-none border border-white bg-transparent p-6 font-bold hover:bg-[#FFFFFF4D] lg:w-fit"
      >
        <Link href={`/storelist`} className="text-sm">
          <span className="font-gt-america-expanded-bold text-white uppercase">Find Where to Buy</span>
        </Link>
      </Button>
    </div>
  );
};

export default StickyBottom;
