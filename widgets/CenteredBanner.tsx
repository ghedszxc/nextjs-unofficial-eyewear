"use client";

import React, { useRef, useEffect, useState } from "react";
import { ICenteredBanner } from "@/models/widgets/ICenteredBanner";
import Image from "next/image";
import Link from "next/link";
import RichText from "@/components/RichText";
import { useIntersectionEntry } from "@/hooks/useIntersectionEntry";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import breakpoints from "@/constants/breakpoints";
import { cn } from "@/lib/utils";

const OBSERVER_OPTIONS: IntersectionObserverInit = { threshold: 0.25 };

const CenteredBanner = ({ title, body, name, image, cta, noTeaserText = false, imageHeight, mobileImageHeight, responsiveImage = false, containerHeight }: ICenteredBanner) => {
  const containerRef = useRef<HTMLDivElement>(null!);
  const { current } = useBreakpoint(breakpoints);
  const isMobile = current === "mobile" || current === "tablet";
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const entry = useIntersectionEntry(containerRef, OBSERVER_OPTIONS);

  const hasVideo = image?.desktop?.mediaType === "video" || image?.mobile?.mediaType === "video";

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const getVideos = () => [desktopVideoRef.current, mobileVideoRef.current].filter(Boolean);

  const togglePlay = () => {
    const videos = getVideos();
    if (isPlaying) {
      videos.forEach((v) => v?.pause());
    } else {
      videos.forEach((v) => v?.play());
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const videos = getVideos();
    videos.forEach((v) => {
      if (v) v.muted = !isMuted;
    });
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    if (!hasVideo) return;
    const videos = getVideos();
    if (entry?.isIntersecting) {
      videos.forEach((v) => v?.play());
      setIsPlaying(true);
    } else {
      videos.forEach((v) => v?.pause());
      setIsPlaying(false);
    }
  }, [entry?.isIntersecting, hasVideo]);

  return (
    <section>
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
          className={cn("relative w-full", hasVideo && "h-full", responsiveImage && "md:h-auto")}
          style={{
            ...(!hasVideo ? { height: isMobile ? (mobileImageHeight || "650px") : (responsiveImage ? undefined : (imageHeight || "650px")) } : {}),
            ...(containerHeight ? { ['--container-h' as string]: containerHeight } : {}),
          }}
        >
        {/* Mobile */}
        {image?.mobile?.url &&
          (image.mobile.mediaType === "video" ? (
            <video
              ref={mobileVideoRef}
              src={image.mobile.url}
              muted
              loop
              playsInline
              className="block h-full w-full object-cover md:hidden"
            />
          ) : (
            <Image
              src={image.mobile.url}
              alt={image.mobile.alt as string}
              fill
              sizes="100vw"
              className="block object-cover md:hidden"
            />
          ))}

        {/* Desktop */}
        {image?.desktop?.url &&
          (image.desktop.mediaType === "video" ? (
            <video
              ref={desktopVideoRef}
              src={image.desktop.url}
              muted
              loop
              playsInline
              className="hidden h-full w-full object-cover md:block"
            />
          ) : responsiveImage ? (
            <Image
              src={image.desktop.url}
              alt={image.desktop.alt || ""}
              width={0}
              height={0}
              sizes="100vw"
              className="hidden h-auto w-full md:block"
              
            />
          ) : (
            <Image
              src={image.desktop.url}
              alt={image.desktop.alt || ""}
              fill
              sizes="100vw"
              className="hidden object-cover md:block"
            />
          ))}

        {/* Video Controls */}
        {hasVideo && (
          <div className="absolute bottom-8 left-8 flex items-center gap-4 rounded-full bg-white/30 px-4 py-2 backdrop-blur-sm">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-black"
            >
              {isPlaying ? (
                <span className="flex items-center gap-[3px]">
                  <span className="h-[10px] w-[1.5px] bg-black" />
                  <span className="h-[10px] w-[1.5px] bg-black" />
                </span>
              ) : (
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2.5} strokeLinecap="butt" strokeLinejoin="miter">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="flex items-center justify-center"
            >
              {isMuted ? (
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 1.5 9 1.5 15 6 15 11 19 11 5" />
                  <line x1={22} y1={9} x2={16} y2={15} />
                  <line x1={16} y1={9} x2={22} y2={15} />
                </svg>
              ) : (
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 1.5 9 1.5 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Text Section Below Image */}
      {!noTeaserText && (
        <div className="bg-white px-6 py-8 lg:px-20 lg:py-20">
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
            {title && <h4 className="font-matter-regular text-2xl leading-normal lg:flex-1">{title}</h4>}

            <div className="flex flex-col gap-4 lg:flex-1">
              {body && (
                <RichText
                  doc={{
                    type: body.doc.type,
                    content: body.doc.content,
                  }}
                  className={{
                    p: "font-matter-regular text-large leading-normal",
                  }}
                />
              )}

              {cta?.href && (
                <Link href={cta.href} className="font-matter-regular text-base underline">
                  {cta.text}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CenteredBanner;
