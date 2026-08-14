"use client";

import { ITwoColumnImage } from "@/models/widgets/ITwoColumnImage";
import Image from "next/image";
import Link from "next/link";
import RichText from "@/components/RichText";
import React, { useEffect, useRef, useState } from "react";

import breakpoints from "@/constants/breakpoints";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";
import { imageSizes } from "@/lib/image-sizes";

const TwoColumnImage = ({ left, right, title, body, bgColor, responsiveImage = false, containerHeight }: ITwoColumnImage) => {
  const { current } = useBreakpoint(breakpoints);
  const isMobile = current === "mobile" || current === "tablet";
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [closingIndex, setClosingIndex] = useState<number | null>(null);
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleTap = (index: number) => {
    if (!isMobile) return;
    setTappedIndex(tappedIndex === index ? null : index);
  };

  useEffect(() => {
    if (!isMobile || tappedIndex === null) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
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
    if (!isMobile || tappedIndex === null || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setTappedIndex(null);
      },
      { threshold: 0 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isMobile, tappedIndex]);

  if (!left && !right) return null;

  const banners = [
    { banner: left, index: 0 },
    { banner: right, index: 1 },
  ];

  return (
    <>
      {/* CSS keyframe animations for popover enter/exit */}
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
      `}</style>

      {containerHeight && (
        <style>{`
          @media (min-width: 1700px) {
            [style*="--container-h"] {
              height: var(--container-h) !important;
            }
          }
        `}</style>
      )}

      <div
        ref={containerRef}
        className={`grid w-full grid-cols-1 pt-0 md:grid-cols-2 lg:pt-2 bg-[${bgColor}] lg:gap-2`}
        style={containerHeight ? { ['--container-h' as string]: containerHeight } as React.CSSProperties : undefined}
      >
        {banners.map(({ banner, index }) => {
          if (!banner?.desktop?.url && !banner?.mobile?.url) return null;
          const thumbnailFallback = banner.mobile?.url || banner.desktop?.url || "";
          const thumbnailAltFallback = banner.mobile?.alt || banner.desktop?.alt || "";

          return (
            <div key={index} className={cn("w-full p-1 px-2 md:p-0 md:px-0", !responsiveImage && "h-[359px] lg:h-[652px]")}>
              <div className={cn("relative w-full", responsiveImage ? "h-[300px] overflow-hidden lg:h-auto" : "h-full overflow-visible")}>
                {/* Mobile image */}
                {banner.mobile?.url && (
                  <Image
                    src={banner.mobile.url}
                    alt={banner.mobile.alt}
                    fill
                    className="block object-cover md:hidden"
                    sizes={imageSizes({ base: "100vw", md: "100vw" })}
                  />
                )}

                {/* Desktop image */}
                {banner.desktop?.url && (
                  responsiveImage ? (
                    <Image
                      src={banner.desktop.url}
                      alt={banner.desktop.alt}
                      width={0}
                      height={0}
                      sizes={imageSizes({ base: "100vw", md: "50vw" })}
                      className="hidden h-auto w-full md:block"
                      
                    />
                  ) : (
                    <Image
                      src={banner.desktop.url}
                      alt={banner.desktop.alt}
                      fill
                      className="hidden object-cover md:block"
                      sizes={imageSizes({ base: "100vw", md: "50vw" })}
                    />
                  )
                )}

                {/* + Button and Popover */}
                {banner?.cta?.href && ( 
                  <div
                    className="absolute bottom-6 left-6 z-10"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      className={cn(
                        "flex h-[64px] w-[64px] items-center justify-center rounded-none transition-opacity duration-200",
                        !banner?.lightBg && "border border-black bg-black/80"
                      )}
                      style={{
                        ...(banner?.lightBg ? { backgroundColor: `${banner.lightBg.slice(0, 7)}99` } : {}),
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
                      <svg width="35" height="35" viewBox="0 0 35 35" fill="none" stroke="currentColor" strokeWidth={2} className={banner?.lightBg ? "text-black" : "text-white"}>
                        <line x1="17.5" y1="0" x2="17.5" y2="35" />
                        <line x1="0" y1="17.5" x2="35" y2="17.5" />
                      </svg>
                    </button>

                    {(isMobile ? tappedIndex === index : hoveredIndex === index || closingIndex === index) && (
                      <div
                        ref={isMobile && tappedIndex === index ? popoverRef : undefined}
                        className={cn(
                          `absolute bottom-0 left-0 z-20 flex items-center gap-4 px-2 pt-4 pb-3 shadow-lg`,
                          isMobile ? "h-[96px] w-[252px]" : "h-[120px] w-[342px]",
                          !banner?.lightBg && "bg-black/80"
                        )}
                        style={
                          isMobile
                            ? { ...(banner?.lightBg ? { backgroundColor: `${banner.lightBg.slice(0, 7)}99` } : {}) }
                            : {
                                ...(banner?.lightBg ? { backgroundColor: `${banner.lightBg.slice(0, 7)}99` } : {}),
                                transformOrigin: "bottom left",
                                animation:
                                  hoveredIndex === index
                                    ? "popoverReveal 0.2s ease-out forwards"
                                    : "popoverExit 0.8s ease-in-out forwards",
                              }
                        }
                        onAnimationEnd={() => {
                          if (!isMobile && closingIndex === index) setClosingIndex(null);
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
                          {banner?.cta?.icon && (
                            <div className="relative h-[45px] w-[85px] md:h-[64px] md:w-[120px] shrink-0 overflow-hidden rounded-md">
                              <Image
                                src={banner.cta.icon}
                                alt={banner.label || ""}
                                fill
                                sizes={imageSizes({ base: "85px", md: "120px" })}
                                className="object-contain"
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className={cn("font-gt-america-standard-light text-[14px] md:text-lg", banner?.lightBg ? "text-black" : "text-white")}>
                              {banner.label}
                            </p>
                            <Link
                              href={banner.cta?.href || "#"}
                              className={cn("font-gt-america-expanded-bold mt-1 inline-flex items-center gap-1 text-[12px] md:text-sm transition", banner?.lightBg ? "text-black hover:text-black" : "text-white hover:text-white")}
                            >
                              {banner.cta?.text || "Call to action"} <span className="hidden md:inline">&rarr;</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {(title || body) && (
        <div className="bg-[#f5f5f5] px-6 py-8 lg:py-10">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2">
            {title && <h4 className="font-matter-regular pl-6 text-2xl leading-normal lg:pl-12">{title}</h4>}
            {body && (
              <div className="pl-6 lg:pr-12 lg:pl-0">
                <RichText
                  doc={{
                    type: body.doc.type,
                    content: body.doc.content,
                  }}
                  className={{
                    p: "font-matter-regular text-base leading-relaxed",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TwoColumnImage;
