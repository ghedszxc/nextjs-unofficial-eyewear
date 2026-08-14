"use client";

import { useEffect, useRef } from "react";
import { useCTAVisibility } from "@/lib/contexts/CTAVisibilityContext";

export const useCTARef = () => {
  const ctaRef = useRef<HTMLDivElement>(null);
  const { setIsCTAVisible } = useCTAVisibility();

  useEffect(() => {
    const ctaElement = ctaRef.current;
    if (!ctaElement) return;

    // IntersectionObserver to detect when CTA enters/leaves viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        // CTA is visible when it intersects the viewport
        setIsCTAVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of CTA is visible
      }
    );

    observer.observe(ctaElement);

    return () => observer.disconnect();
  }, [setIsCTAVisible]);

  return ctaRef;
};
