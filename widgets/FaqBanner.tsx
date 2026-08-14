"use client";

import React, { useState, useEffect } from "react";
import { IFaqBanner } from "@/models/widgets/IFaqBanner";
import { ArrowRight, X } from "lucide-react";
import { useSearch } from "@/context/SearchContext";

const FaqBanner = ({ heading }: IFaqBanner) => {
  const { searchQuery, setSearchQuery, isSearching, hasOpenAccordion } = useSearch();
  const [placeholder, setPlaceholder] = useState("Search");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const update = () =>
      setPlaceholder(window.innerWidth >= 1024 ? "Search your store" : "Search");
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <>
      <div className="bg-black pt-6 lg:pt-24" />
      <section className="bg-[#000000] max-w-9xl px-6 lg:px-20 pt-20">
        <div className="mx-auto max-w-9xl">
          {heading && (
            <h2 className="font-gt-america-expanded-bold mb-4 text-2xl text-white lg:text-3xl">
              {heading}
            </h2>
          )}
          <div className="bg-black font-gt-america-standard-light font-light pb-6 text-base text-white lg:pb-[80px]">
          <p>
            You&apos;ve got questions. We&apos;ve got answers.
          </p>
          </div>
          <div className={`flex items-center gap-3 mt-10 lg:mt-0 lg:py-8 transition-[padding] duration-300 ${isFocused ? "pb-10" : ""}`}>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { setIsFocused(true); window.dispatchEvent(new CustomEvent("faq-search-focus", { detail: { focused: true } })); }}
                onBlur={() => { setIsFocused(false); window.dispatchEvent(new CustomEvent("faq-search-focus", { detail: { focused: false } })); }}
                className="w-full rounded-full border border-white bg-black py-3 pr-28 pl-5 text-white placeholder-white placeholder:text-xl placeholder:font-gt-america-standard-light outline-none focus:border-white"
              />
              {!searchQuery && (
                <button
                  type="button"
                  className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-[10px] rounded-full px-4 py-1.5 text-base text-white/80 transition-colors hover:text-white"
                >
                  <span className="hidden font-gt-america-expanded-bold text-[14px] font-bold text-white lg:inline">DISCOVER MORE</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="shrink-0 flex items-center justify-center text-white transition-colors hover:text-white"
              >
                <div className="flex items-center justify-center h-9 w-9 rounded-full border border-white">
                   <X className="h-5 w-5" />
                </div>
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default FaqBanner;
