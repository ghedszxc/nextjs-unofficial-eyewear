"use client";

import CampaignCard from "@/components/CampaignCard";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";
import { ICampaignCollection } from "@/models/widgets/ICampaignCollection";
import AutoScroll from "embla-carousel-auto-scroll";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const NORMAL_SPEED = 1.20;
const HOVER_SPEED = 0.5;
const MIN_ITEMS_FOR_LOOP = 12;

const CampaignCollection = ({ campaigns }: ICampaignCollection) => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const rafRef = useRef<number>(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const { matches } = useBreakpoint({ mobile: 0, tablet: 768, laptop: 1024, desktop: 1440 });
  const isDesktop = matches.tablet;

  const duplicatedCampaigns = useMemo(() => {
    if (!campaigns || campaigns.length === 0) return [];
    const items = [...campaigns];
    while (items.length < MIN_ITEMS_FOR_LOOP) {
      items.push(...campaigns);
    }
    return items;
  }, [campaigns]);

  const stopSlowScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const startSlowScroll = useCallback(() => {
    if (!api) return;
    stopSlowScroll();
    const tick = () => {
      if (isDraggingRef.current || !api) return;
      const engine = api.internalEngine();
      engine.location.add(-HOVER_SPEED);
      engine.target.set(engine.location);
      engine.previousLocation.set(engine.location);
      engine.scrollLooper.loop(engine.scrollBody.velocity());
      engine.slideLooper.loop();
      engine.translate.to(engine.location.get());
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [api, stopSlowScroll]);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    if (!isDesktop || !api) return;
    const autoScroll = api.plugins()?.autoScroll as
      | { stop: () => void; isPlaying: () => boolean }
      | undefined;
    if (autoScroll?.isPlaying()) autoScroll.stop();
    startSlowScroll();
  }, [api, isDesktop, startSlowScroll]);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    if (!isDesktop || !api) return;
    stopSlowScroll();
    const autoScroll = api.plugins()?.autoScroll as
      | { play: (delay?: number) => void; isPlaying: () => boolean }
      | undefined;
    if (autoScroll && !autoScroll.isPlaying()) autoScroll.play(0);
  }, [api, isDesktop, stopSlowScroll]);

  // Handle drag interactions (desktop only)
  useEffect(() => {
    if (!api || !isDesktop) return;

    const rootNode = api.rootNode();

    // Native capture-phase listener fires BEFORE Embla processes the drag,
    // ensuring the RAF is stopped and engine state is clean
    const onNativePointerDown = () => {
      isDraggingRef.current = true;
      stopSlowScroll();
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      if (isHoveredRef.current) {
        // Hovering: resume slow scroll after Embla settles
        const onSettle = () => {
          api.off("settle", onSettle);
          if (isHoveredRef.current && !isDraggingRef.current) {
            startSlowScroll();
          }
        };
        api.on("settle", onSettle);
      } else {
        // Not hovering: resume AutoScroll after Embla settles
        const onSettle = () => {
          api.off("settle", onSettle);
          const autoScroll = api.plugins()?.autoScroll as
            | { play: (delay?: number) => void; isPlaying: () => boolean }
            | undefined;
          if (autoScroll && !autoScroll.isPlaying()) autoScroll.play(0);
        };
        api.on("settle", onSettle);
      }
    };

    rootNode.addEventListener("pointerdown", onNativePointerDown, true);
    api.on("pointerUp", onPointerUp);

    return () => {
      rootNode.removeEventListener("pointerdown", onNativePointerDown, true);
      api.off("pointerUp", onPointerUp);
    };
  }, [api, isDesktop, startSlowScroll, stopSlowScroll]);

  // Track current slide index for mobile counter
  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrentSlide(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="py-8 md:pb-20"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragStart={isDesktop ? (e) => e.preventDefault() : undefined}
    >
      <Carousel
        key={isDesktop ? "desktop" : "mobile"}
        setApi={setApi}
        plugins={
          isDesktop
            ? [
                AutoScroll({
                  speed: NORMAL_SPEED,
                  startDelay: 0,
                  stopOnInteraction: true,
                  stopOnMouseEnter: false,
                }),
              ]
            : []
        }
        opts={{
          ...(isDesktop
            ? { loop: true }
            : { loop: false, align: "center", watchDrag: false })
        }}
        className="flex w-full flex-col gap-8"
      >
        <CarouselContent className="!-ml-[0px] gap-4 md:gap-0 will-change-transform">
          {(isDesktop ? duplicatedCampaigns : (campaigns ?? [])).map((campaign, index) => (
            <CarouselItem
              key={index}
              className={cn("basis-full !pl-0 md:basis-auto md:!pl-[80px]")}
            >
              <CampaignCard
                image={campaign.image}
                name={campaign.name}
                cta={campaign.cta}
                icon={campaign.icon}
                {...(!isDesktop &&
                  campaigns &&
                  campaigns.length > 0 && {
                    counter: `${currentSlide + 1}/${campaigns.length}`,
                  })}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex w-full justify-between px-8 md:hidden md:px-0">
          <CarouselPrevious className="static inset-auto w-auto translate-y-0 rounded-none border-0" variant="ghost" />
          <CarouselNext className="static inset-auto w-auto translate-y-0 rounded-none border-0" variant="ghost" />
        </div>
      </Carousel>
    </div>
  );
};

export default CampaignCollection;
