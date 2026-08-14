"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { ITwoColumnTextAndMedia } from "@/models/widgets/ITwoColumnTextAndMedia";
import { Button } from "@/components/ui/button";

import breakpoints from "@/constants/breakpoints";
import { useBreakpoint } from "@/hooks/useBreakpoint";

import RichText from "@/components/RichText";
import { StoryblokRichTextNodeTypes } from "@storyblok/react";
import { cn } from "@/lib/utils";
import { imageSizes } from "@/lib/image-sizes";

function isDarkColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

const TwoColumnTextAndMedia = ({
  image,
  title,
  titleMobile,
  subtitle,
  ctas,
  imagePosition = "left",
  bgColor = "#000000",
  outerBgColor = "#000000",
  pt,
  ctaWidth,
  ctaLayout,
  maxWidth,
  productCtas,
  containerHeight,
  responsiveImage = false,
}: ITwoColumnTextAndMedia) => {
  const dark = isDarkColor(bgColor);
  const textColor = dark ? "!text-white" : "!text-black";
  const borderColor = dark ? "!border-white" : "!border-black";

  const isLeft = imagePosition === "left";

  const { current } = useBreakpoint(breakpoints);
  const isMobile = current === "mobile" || current === "tablet";
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsClosing(false);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsClosing(true);
    setIsOpen(false);
  };

  const handleTap = () => {
    if (!isMobile) return;
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isMobile || !isOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobile, isOpen]);

  useEffect(() => {
    if (!isMobile || !isOpen || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setIsOpen(false);
      },
      { threshold: 0 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isMobile, isOpen]);

  const thumbnail = image?.mobile?.url || image?.desktop?.url || "";
  const thumbnailAlt = image?.mobile?.alt || image?.desktop?.alt || "";

  const imageColumn = (
    <div
      className={cn(
        "relative order-1 aspect-square w-full lg:aspect-auto lg:w-1/2",
        responsiveImage ? "overflow-hidden" : "overflow-visible lg:h-auto",
        isLeft ? "lg:order-1" : "lg:order-2"
      )}
    >
      {image?.mobile?.url && (
        <Image
          src={image.mobile.url}
          alt={image.mobile.alt || ""}
          fill
          sizes={imageSizes({ base: "100vw", lg: "50vw" })}
          className="object-cover lg:hidden"
        />
      )}
      {image?.desktop?.url &&
        (responsiveImage ? (
          <Image
            src={image.desktop.url}
            alt={image.desktop.alt || ""}
            width={0}
            height={0}
            sizes="50vw"
            
            className="hidden h-auto w-full lg:block lg:h-full lg:object-cover"
          />
        ) : (
          <Image
            src={image.desktop.url}
            alt={image.desktop.alt || ""}
            fill
            sizes={imageSizes({ base: "100vw", lg: "50vw" })}
            className="hidden object-cover lg:block"
          />
        ))}

      {/* + Button and Popover */}
      {productCtas?.length && (
        <div className="absolute bottom-6 left-6 z-10" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <button
            className="flex h-[64px] w-[64px] items-center justify-center rounded-none border border-black bg-black/80 transition-opacity duration-200"
            style={{
              opacity: isMobile ? (isOpen ? 0 : 1) : isOpen || isClosing ? 0 : 1,
            }}
            onClick={handleTap}
            aria-label="View product details"
          >
            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" stroke="currentColor" strokeWidth={2} className="text-white">
              <line x1="17.5" y1="0" x2="17.5" y2="35" />
              <line x1="0" y1="17.5" x2="35" y2="17.5" />
            </svg>
          </button>

          {(isMobile ? isOpen : isOpen || isClosing) && (
            <div
              ref={isMobile && isOpen ? popoverRef : undefined}
              className="absolute bottom-0 left-0 z-20 flex w-[375px] flex-col gap-4"
            >
              {productCtas?.map((product, idx) => (
                <React.Fragment key={idx}>
                  <div
                    className={`flex items-center gap-4 bg-black/80 px-2 pt-4 pb-3 shadow-lg ${
                      isMobile ? "h-[96px] w-[252px]" : "h-[120px] w-[342px]"
                    }`}
                    style={
                      isMobile
                        ? {}
                        : {
                            transformOrigin: "bottom left",
                            animation: isOpen ? "popoverReveal 0.2s ease-out forwards" : "popoverExit 0.8s ease-in-out forwards",
                          }
                    }
                    onAnimationEnd={() => {
                      if (!isMobile && isClosing && idx === (productCtas?.length ?? 1) - 1) setIsClosing(false);
                    }}
                  >
                    <div
                      className="flex items-center gap-2"
                      style={
                        isMobile
                          ? {}
                          : {
                              ...(!isOpen
                                ? { animation: "contentSlide 0.8s ease-in-out forwards" }
                                : {}),
                            }
                      }
                    >
                      {product?.thumbnail && (
                        <div className="relative h-[45px] w-[85px] md:h-[64px] md:w-[120px] shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={product.thumbnail}
                            alt={product.label || ""}
                            fill
                            sizes={imageSizes({ base: "85px", md: "120px" })}
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-gt-america-standard-light text-[14px] md:text-lg text-white">
                          {product.label}
                        </p>
                        <Link
                          href={product.href || "/"}
                          className="font-gt-america-expanded-bold mt-1 inline-flex items-center gap-1 text-[12px] md:text-sm text-white transition hover:text-white"
                        >
                          {product.text} <span className="hidden md:inline">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const textColumn = (
    <div
      className={`order-2 flex w-full flex-col justify-center px-6 py-8 lg:w-1/2 lg:px-[80px] lg:py-[40px]  ${
        isLeft ? "lg:order-2" : "lg:order-1"
      }`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex flex-col gap-6 lg:gap-[40px]">
        <div className="flex flex-col gap-4">
          {title && (
            <>
              <span
                className={cn(
                  `font-gt-america-expanded-bold text-2xl leading-[1.3] uppercase`,
                  textColor,
                  titleMobile ? "hidden lg:block" : "block"
                )}
              >
                {title}
              </span>
            </>
          )}
          {titleMobile && (
            <span
              className={cn(
                `font-gt-america-expanded-bold block text-2xl leading-[1.3] uppercase lg:hidden`,
                textColor
              )}
            >
              {titleMobile}
            </span>
          )}

          {subtitle?.doc?.content && (
            <RichText
              doc={{
                ...subtitle.doc,
                type: "doc" as StoryblokRichTextNodeTypes,
              }}
              className={{
                p: `font-gt-america-standard-light text-base ${textColor} ${maxWidth ? `max-w-${maxWidth}` : ""}`,
              }}
            />
          )}
        </div>

        {ctas && ctas.length > 0 && (
          <div
            className={cn("flex flex-col gap-6", ctaLayout !== "block" && "lg:flex-row")}
            {...(ctaWidth ? { style: { "--cta-width": ctaWidth } as React.CSSProperties } : {})}
          >
            {ctas.map((cta, index) => (
              <Button
                key={index}
                variant="outline"
                asChild
                className={cn(
                  "font-gt-america-expanded-bold h-auto w-full rounded-none !bg-transparent p-4 text-sm leading-[1.3] font-bold uppercase !shadow-none hover:!bg-white/10",
                  ctaWidth ? "lg:w-[var(--cta-width)]" : "lg:flex-1",
                  borderColor,
                  textColor
                )}
              >
                <Link href={cta.href || "#"}>{cta.text}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={cn("flex w-full flex-col lg:flex-row", !responsiveImage && "lg:h-[720px]")}
      style={{
        backgroundColor: outerBgColor,
        ...(pt ? { paddingTop: pt } : {}),
        ...(containerHeight ? { ["--container-h" as string]: containerHeight } : {}),
      }}
    >
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
        @media (min-width: 1700px) {
          [style*="--container-h"] {
            height: var(--container-h) !important;
          }
        }
      `}</style>
      {textColumn}
      {imageColumn}
    </div>
  );
};

export default TwoColumnTextAndMedia;
