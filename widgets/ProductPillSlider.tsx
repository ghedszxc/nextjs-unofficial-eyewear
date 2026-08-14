"use client";

import { IProductPillSlider } from "@/models/widgets/IProductPillSlider";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import breakpoints from "@/constants/breakpoints";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { imageSizes } from "@/lib/image-sizes";

const ProductPillSlider = ({ title, pills, maxVisibleButtons }: IProductPillSlider) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { current } = useBreakpoint(breakpoints);

  const isMobile = current === "mobile" || current === "tablet";

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [closingIndex, setClosingIndex] = useState<number | null>(null);
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const getCardWidth = () => {
    const firstCard = scrollRef.current?.firstElementChild as HTMLElement | null;
    return firstCard ? firstCard.offsetWidth + 20 : 520;
  };

  const updateActiveIndex = useCallback(() => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = getCardWidth();
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateActiveIndex);
    return () => el.removeEventListener("scroll", updateActiveIndex);
  }, [updateActiveIndex]);

  const handleMouseEnter = (index: number) => {
    if (isMobile) return;
    setClosingIndex(null);
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setClosingIndex(hoveredIndex);
    setHoveredIndex(null);
  };

  const popoverRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleTap = (index: number) => {
    if (!isMobile) return;
    setTappedIndex(tappedIndex === index ? null : index);
  };

  useEffect(() => {
    if (!isMobile || tappedIndex === null) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setTappedIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobile, tappedIndex]);

  useEffect(() => {
    if (!isMobile || tappedIndex === null || !sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setTappedIndex(null);
      },
      { threshold: 0 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isMobile, tappedIndex]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = getCardWidth();
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section ref={sectionRef} className="py-10 md:py-20">
      <style>{`
        @keyframes popoverReveal {
          0% {
            clip-path: inset(50% 50% 0% 0%);
          }
          100% {
            clip-path: inset(0% 0% 0% 0%);
          }
        }
        @keyframes popoverExit {
          0% {
            clip-path: inset(0% 0% 0% 0%);
          }
          50% {
            clip-path: inset(50% 0% 0% 0%);
          }
          100% {
            clip-path: inset(50% 100% 0% 0%);
          }
        }
         @keyframes contentSlide {
  0% {
    transform: translateY(0%);
  }

  50% {
    transform: translateY(45%);
  }

  100% {
    transform: translateY(42%);
  }
}
        @media (min-width: 2000px) {
          .pps-card {
            width: calc(50% - 10px);
            height: auto;
            aspect-ratio: 1;
            flex-shrink: 0;
          }
        }
      `}</style>

      {title && (
        <h2 className="mb-8 text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h2>
      )}

      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          className="pps-scroll flex gap-6 overflow-x-auto scroll-smooth no-scrollbar lg:gap-20"
        >
          {pills?.map((pill, index) => (
            <div
              key={index}
              className="pps-card relative h-[calc(100vw-2rem)] w-[calc(100vw-2rem)] shrink-0 overflow-visible md:h-[500px] md:w-[500px]"
            >
              <Link
                href={pill.targetUrl || "#"}
                className="relative block h-full w-full overflow-hidden"
              >
                {pill.image?.url && (
                  <Image
                    src={pill.image.url}
                    alt={pill.image.alt || pill.label}
                    fill
                    sizes={imageSizes({ base: "100vw", md: "500px" })}
                    className="object-cover"
                  />
                )}
              </Link>

              {(maxVisibleButtons === undefined || index < maxVisibleButtons) && (
              <div
                className="absolute bottom-6 left-6 z-10 "
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="flex h-[64px] w-[64px] items-center justify-center rounded-none border border-black bg-black/80 transition-opacity duration-200"
                  style={{
                    opacity: isMobile
                      ? tappedIndex === index
                        ? 0
                        : 1
                      : hoveredIndex === index || closingIndex === index
                        ? 0
                        : 1,
                  }}
                  onClick={() => handleTap(index)}
                  aria-label="View product details"
                >
                  <svg width="35" height="35" viewBox="0 0 35 35" fill="none" stroke="currentColor" strokeWidth={2} className="text-white">
                    <line x1="17.5" y1="0" x2="17.5" y2="35" />
                    <line x1="0" y1="17.5" x2="35" y2="17.5" />
                  </svg>
                </button>

                {(isMobile
                  ? tappedIndex === index
                  : hoveredIndex === index || closingIndex === index) && (
                  <div
                    ref={
                      isMobile && tappedIndex === index
                        ? popoverRef
                        : undefined
                    }
                    className={`absolute bottom-0 left-0 z-20 flex items-center gap-4  bg-black/80 px-2 pt-4 pb-3 shadow-lg ${
  isMobile ? "h-[96px] w-[252px]" : "h-[120px] w-[342px]"
}`}
                    style={
                      isMobile
                        ? {}
                        : {
                            transformOrigin: "bottom left",
                            animation:
                              hoveredIndex === index
                                ? "popoverReveal 0.2s ease-out forwards"
                                : "popoverExit 0.8s ease-in-out forwards",
                          }
                    }
                    onAnimationEnd={() => {
                      if (!isMobile && closingIndex === index)
                        setClosingIndex(null);
                    }}
                  >
                    <div
                      className="flex items-center gap-2"
                      style={
                        isMobile
                          ? {}
                          : {
                              ...(hoveredIndex !== index
                                ? { animation: "contentSlide 0.8s ease-in-out forwards" }
                                : {}),
                            }
                      }
                    >
                      {pill.icon?.url && (
                        <div className="relative h-[45px] w-[85px] md:h-[64px] md:w-[120px] shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={pill.icon.url}
                            alt={pill.icon.alt || pill.name}
                            fill
                            sizes={imageSizes({ base: "85px", md: "120px" })}
                            className="object-contain"
                          />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="font-gt-america-standard-light text-[14px] md:text-lg text-white ">
                          {pill.label}
                        </p>
                        <Link
                          href={pill.targetUrl || "#"}
                          className="font-gt-america-expanded-bold mt-1 inline-flex items-center gap-1 text-[12px] md:text-sm text-white transition hover:text-white"
                        >
                          {pill.ctaText || "View product"}
                          {pill.ctaIcon?.url ? (
                            <Image src={pill.ctaIcon.url} alt={pill.ctaIcon.alt || ""} width={16} height={16} className="hidden md:inline-block invert"  />
                          ) : (
                            <span className="hidden md:inline">&rarr;</span>
                          )}
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="pps-nav mt-6 flex items-center justify-end gap-4 px-[24px] md:px-[40px]">
        <button
          onClick={() => scroll("left")}
          className="flex h-8 w-8 items-center justify-center transition hover:opacity-70"
          aria-label="Scroll left"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22,4 10,16 22,28" />
          </svg>
        </button>

        <span className="inline-block w-[2ch]" aria-hidden="true" />

        <button
          onClick={() => scroll("right")}
          className="flex h-8 w-8 items-center justify-center transition hover:opacity-70"
          aria-label="Scroll right"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="10,4 22,16 10,28" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default ProductPillSlider;
