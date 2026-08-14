"use client";

import React, { useState, useRef, useEffect } from "react";
import { IFaqTab } from "@/models/widgets/IFaqTab";
import { useSearch } from "@/context/SearchContext";

const FaqTab = ({ tabs }: IFaqTab) => {
  const [activeTab, setActiveTab] = useState(0);
  const { isSearching, searchQuery, hasSearchResults } = useSearch();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const sectionHeight = useRef(0);
  const [isStuck, setIsStuck] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const lastScrollY = useRef(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isManualScrolling = useRef(false);

  useEffect(() => {
    const handleSearchFocus = (e: Event) => {
      const { focused } = (e as CustomEvent).detail;
      setIsSearchFocused(focused);
    };

    window.addEventListener("faq-search-focus", handleSearchFocus);
    return () => window.removeEventListener("faq-search-focus", handleSearchFocus);
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) return;

    let observer: IntersectionObserver;

    const createObserver = () => {
      observer?.disconnect();
      const navbarHeight = window.innerWidth >= 1024 ? 112 : 80;

      observer = new IntersectionObserver(
        ([entry]) => setIsStuck(!entry.isIntersecting),
        { rootMargin: `-${navbarHeight}px 0px 0px 0px` }
      );

      if (sentinelRef.current) observer.observe(sentinelRef.current);
    };

    createObserver();
    window.addEventListener("resize", createObserver);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", createObserver);
    };
  }, []);

  useEffect(() => {
    if (!isStuck && sectionRef.current) {
      sectionHeight.current = sectionRef.current.offsetHeight;
    }
  }, [isStuck]);

  useEffect(() => {
    if (!isStuck) return;

    const onScroll = () => {
      const currentY = window.scrollY;
      setScrollDirection(currentY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isStuck]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("faqtab-sticky", {
        detail: { stuck: isStuck, scrollDirection },
      })
    );
  }, [isStuck, scrollDirection]);

  useEffect(() => {
    if (!tabs || tabs.length === 0) return;
    if (isStuck && scrollDirection === "up") return;

    const anchorTargets = tabs
      .map((tab, index) => ({
        index,
        element: tab.anchorTarget
          ? document.getElementById(tab.anchorTarget)
          : null,
      }))
      .filter(
        (item): item is { index: number; element: HTMLElement } =>
          item.element !== null
      );

    if (anchorTargets.length === 0) return;

    const navbarHeight = window.innerWidth >= 1024 ? 112 : 80;
    const tabBarHeight = sectionRef.current?.offsetHeight ?? 60;
    const topOffset = isStuck ? tabBarHeight : navbarHeight + tabBarHeight;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = anchorTargets.find(
              (item) => item.element === entry.target
            );
            if (match && !isManualScrolling.current) setActiveTab(match.index);
          }
        });
      },
      {
        rootMargin: `-${topOffset}px 0px -80% 0px`,
      }
    );

    anchorTargets.forEach(({ element }) => observer.observe(element));

    return () => observer.disconnect();
  }, [tabs, isStuck, scrollDirection]);

  useEffect(() => {
    if (!isStuck || scrollDirection !== "up" || !tabs || tabs.length === 0) return;

    const navbarHeight = window.innerWidth >= 1024 ? 112 : 80;
    const tabBarHeight = sectionRef.current?.offsetHeight ?? 60;
    const stickyBottom = navbarHeight + tabBarHeight;

    const anchorTargets = tabs
      .map((tab, index) => ({
        index,
        element: tab.anchorTarget
          ? document.getElementById(tab.anchorTarget)
          : null,
      }))
      .filter(
        (item): item is { index: number; element: HTMLElement } =>
          item.element !== null
      );

    if (anchorTargets.length === 0) return;

    const onScroll = () => {
      if (isManualScrolling.current) return;

      let activeIdx = 0;
      let found = false;
      for (const { index, element } of anchorTargets) {
        const top = element.getBoundingClientRect().top;
        if (top >= stickyBottom && top <= window.innerHeight) {
          activeIdx = index;
          found = true;
          break;
        }
      }
      if (!found) {
        for (const { index, element } of anchorTargets) {
          if (element.getBoundingClientRect().top <= stickyBottom) {
            activeIdx = index;
          }
        }
      }

      setActiveTab(activeIdx);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isStuck, scrollDirection, tabs]);
  useEffect(() => {
    if (window.innerWidth >= 1024) return;

    const container = tabContainerRef.current;
    const activeButton = tabRefs.current[activeTab];
    if (!container || !activeButton) return;

    const scrollLeft =
      activeButton.offsetLeft -
      container.offsetLeft -
      container.clientWidth / 2 +
      activeButton.offsetWidth / 2;

    container.scrollTo({ left: scrollLeft, behavior: "smooth" });
  }, [activeTab]);

  if (!tabs || tabs.length === 0) return null;

  const handleTabClick = (index: number, anchorTarget?: string) => {
    setActiveTab(index);

    if (anchorTarget) {
      const target = document.getElementById(anchorTarget);
      if (target) {
        const navbarHeight = window.innerWidth >= 1024 ? 112 : 80;
        const tabBarHeight = sectionRef.current?.offsetHeight ?? 60;
        const offset = navbarHeight + tabBarHeight;
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;

        isManualScrolling.current = true;
        window.scrollTo({ top, behavior: "smooth" });

        const resetFlag = () => { isManualScrolling.current = false; };
        const fallbackTimer = setTimeout(resetFlag, 1200);

        window.addEventListener("scrollend", () => {
          clearTimeout(fallbackTimer);
          resetFlag();
        }, { once: true });
      }
    }
  };

  return (
    <>
      <div ref={sentinelRef} className="h-0" />
      {isStuck && <div style={{ height: sectionHeight.current }} />}
      <section
        ref={sectionRef}
        className={`max-w-9xl font-gt-america-standard-light bg-[#000000] py-8 ${
          isSearchFocused ? "hidden" : ""
        } ${
          isStuck
            ? "fixed left-0 right-0 z-20 bg-[#000000]/80 backdrop-blur-sm transition-[top] duration-300 ease-in-out"
            : ""
        }`}
        style={
          isStuck
            ? { top: scrollDirection === "up" ? (window.innerWidth >= 1024 ? "88px" : "80px") : "0px" }
            : undefined
        }
      >
        <div className="mx-auto max-w-9xl">
          <div ref={tabContainerRef} className="flex flex-nowrap justify-evenly gap-3 overflow-x-auto no-scrollbar px-8 lg:px-20 lg:flex-nowrap lg:justify-center lg:gap-4">
            {tabs.map((tab, index) => (
              <button
                key={index}
                ref={(el) => { tabRefs.current[index] = el; }}
                onClick={() => handleTabClick(index, tab.anchorTarget)}
                className={`shrink-0 rounded-full border px-8 py-2 text-xl font-gt-america-standard-light font-light transition-colors lg:text-lg ${
                  activeTab === index
                    ? "border-white bg-[#ffffff] text-[#3A3A2C]"
                    : "border-white/40 bg-transparent text-white hover:bg-[#DEDEDE]/70"
                }`}
              >
                {tab.tabName}
              </button>
            ))}
          </div>
        </div>
      </section>
      {isSearching && (
        <div className="bg-white px-8 lg:px-20 pt-8 text-black text-lg">
          <div className="mx-auto max-w-9xl">
            {hasSearchResults ? (
              <p className="font-gt-america-standard-regular text-lg">
                Results for &lsquo;{searchQuery.trim()}&rsquo;
              </p>
            ) : (
              <>
                <p className="font-gt-america-standard-regular py-12">No results found</p>
                <p className="font-gt-america-standard-regular">
                  We couldn&apos;t find anything for &ldquo;
                  {searchQuery.trim()}&rdquo;
                </p>
                <p className="font-gt-america-standard-regular pb-12">
                  Try using broader or alternative keyword or check for any
                  spelling errors.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FaqTab;
