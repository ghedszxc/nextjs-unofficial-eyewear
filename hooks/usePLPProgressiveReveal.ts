import { useCallback, useMemo, useState, useEffect } from "react";

interface UsePLPProgressiveRevealOptions {
  totalProducts: number;
  isMobile: boolean;
  desktopPageSize: number;
  mobilePageSize: number;
  hasCampaignLayout: boolean;
}

interface UsePLPProgressiveRevealReturn {
  visibleCount: number;
  hasMore: boolean;
  revealMore: () => void;
  reset: () => void;
}

export const usePLPProgressiveReveal = ({
  totalProducts,
  isMobile,
  desktopPageSize,
  mobilePageSize,
  hasCampaignLayout,
}: UsePLPProgressiveRevealOptions): UsePLPProgressiveRevealReturn => {
  // Track current visible count AND whether we've initialized
  const [visibleCount, setVisibleCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Determine effective page size based on current breakpoint
  const pageSize = useMemo(() => {
    return isMobile ? mobilePageSize : desktopPageSize;
  }, [isMobile, mobilePageSize, desktopPageSize]);

  // Initialize on first mount or when pageSize changes
  // This ONLY runs once per mount/pageSize change
  useEffect(() => {
    if (!isInitialized && pageSize > 0 && totalProducts > 0) {
      setVisibleCount(pageSize);
      setIsInitialized(true);
    }
  }, [pageSize, totalProducts, isInitialized]);

  // Check if there are more products to reveal
  const hasMore = useMemo(() => {
    return visibleCount < totalProducts;
  }, [visibleCount, totalProducts]);

  // Increment visible count by one page size
  const revealMore = useCallback(() => {
    setVisibleCount((prev) => {
      const newCount = prev + pageSize;
      return Math.min(newCount, totalProducts);
    });
  }, [pageSize, totalProducts]);

  // Reset to initial state (useful for filter changes)
  const reset = useCallback(() => {
    setVisibleCount(0);
    setIsInitialized(false);
  }, []);

  return {
    visibleCount,
    hasMore,
    revealMore,
    reset,
  };
};
