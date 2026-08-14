"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ICardSlider } from "@/models/widgets/ICardSlider";
import AutoScroll from "embla-carousel-auto-scroll";
import Image from "next/image";
import Link from "next/link";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { imageSizes } from "@/lib/image-sizes";

const NORMAL_SPEED = 1;
const HOVER_SPEED = 0.5;
const MIN_ITEMS_FOR_LOOP = 12;

const CardSlider = ({ items }: ICardSlider) => {
  const [api, setApi] = useState<CarouselApi>();
  const rafRef = useRef<number>(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const { matches } = useBreakpoint({ mobile: 0, tablet: 768, laptop: 1024, desktop: 1440 });
  const isDesktop = matches.tablet;

  const duplicatedItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    const result = [...items];
    while (result.length < MIN_ITEMS_FOR_LOOP) {
      result.push(...items);
    }
    return result;
  }, [items]);

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

    const onNativePointerDown = () => {
      isDraggingRef.current = true;
      stopSlowScroll();
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      if (isHoveredRef.current) {
        const onSettle = () => {
          api.off("settle", onSettle);
          if (isHoveredRef.current && !isDraggingRef.current) {
            startSlowScroll();
          }
        };
        api.on("settle", onSettle);
      } else {
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

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <section className="bg-black px-2 pb-12 md:px-0 md:pb-0 md:py-2" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Carousel
        key={isDesktop ? "desktop" : "mobile"}
        setApi={setApi}
        plugins={
          isDesktop ? [AutoScroll({ speed: NORMAL_SPEED, startDelay: 0, stopOnInteraction: true, stopOnMouseEnter: false })] : []
        }
        opts={{ loop: isDesktop, ...(isDesktop ? {} : { align: "center", watchDrag: false }) }}
      >
        <CarouselContent className="!-ml-[0px] will-change-transform">
          {(isDesktop ? duplicatedItems : items).map((item, index) => (
            <CarouselItem key={index} className={cn("basis-auto !pl-[8px]")}>
              <Link href={item.href}>
                <div className="relative h-[400px] w-[320px] overflow-hidden lg:h-[550px] lg:w-[500px]">
                  <Image src={item.image} alt={item.alt} fill sizes={imageSizes({ base: "320px", lg: "500px" })} className="object-cover"  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-8 flex w-full justify-between px-6 md:hidden">
          <CarouselPrevious
            className="static inset-auto h-[32px] w-[32px] w-auto translate-y-0 rounded-none border-0 px-4 text-white"
            variant="ghost"
          />
          <CarouselNext
            className="static inset-auto h-[32px] w-[32px] w-auto translate-y-0 rounded-none border-0 px-4 text-white"
            variant="ghost"
          />
        </div>
      </Carousel>
    </section>
  );
};

export default CardSlider;
