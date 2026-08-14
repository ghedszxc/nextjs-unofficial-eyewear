"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ITabCareTips } from "@/models/widgets/ITabCareTips";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichText from "@/components/RichText";

const TabCareTips = ({ tabs }: ITabCareTips) => {
  const tabsListContainerRef = useRef<HTMLDivElement>(null);
  const [showRightFade, setShowRightFade] = useState(false);

  const checkScroll = useCallback(() => {
    const container = tabsListContainerRef.current;
    if (!container) return;
    const el = container.querySelector<HTMLElement>(
      '[data-slot="tabs-list"]'
    );
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowRightFade(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    const container = tabsListContainerRef.current;
    if (!container) return;
    const el = container.querySelector<HTMLElement>(
      '[data-slot="tabs-list"]'
    );
    if (!el) return;

    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [tabs, checkScroll]);

  if (!tabs || tabs.length === 0) return null;

  return (
    <section className="bg-white px-8 pb-4 lg:px-20 lg:pb-6 overflow-hidden">
      <div className="mx-auto max-w-5xl xl:max-w-full">
        <Tabs defaultValue={tabs[0].tabName}>
          <div ref={tabsListContainerRef} className="relative lg:pb-20">
            <TabsList
              variant="line"
              className="mb-1 flex !h-auto w-full justify-start gap-20 py-6 overflow-x-auto overflow-y-hidden scrollbar-hide"
            >
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.tabName}
                  value={tab.tabName}
                  className="font-gt-america-standard-regular flex-none px-0 pb-2 text-lg text-black hover:after:opacity-100 after:!bottom-[5px] data-[state=active]:text-black data-[state=active]:font-bold"
                >
                  {tab.tabName}
                </TabsTrigger>
              ))}
            </TabsList>
            <div
              className={`pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-r from-transparent to-white transition-opacity duration-300 lg:hidden ${
                showRightFade ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            />
          </div>

          {tabs.map((tab) => (
              <TabsContent key={tab.tabName} value={tab.tabName}>
                <div className="grid grid-cols-1 gap-0 bg-[#F6F6F6] p-6 lg:grid-cols-2 lg:gap-8 lg:p-20 mb-8">
                  <div className="flex flex-col items-start gap-[18px] lg:gap-8 pt-6 sm:pt-12 lg:flex-row lg:pt-6">
                    {tab.icon?.url && (
                      <Image
                        src={tab.icon.url}
                        alt={tab.icon.alt}
                        width={32}
                        height={32}
                        
                      />
                    )}
                    <h3 className="font-gt-america-standard-regular text-3xl lg:text-3xl text-[#000000]">
                      {tab.tabName}
                    </h3>
                  </div>

                  <div className="flex flex-col justify-start pt-6 sm:pt-12 lg:pt-6 gap-4">
                    {tab.tabContent?.doc && (
                      <div className="[&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-4 lg:[&_li]:mb-1 [&_p]:mb-4 lg:[&_p]:mb-2">
                        <RichText
                          doc={{
                            type: tab.tabContent.doc.type,
                            content: tab.tabContent.doc.content,
                          }}
                          className={{
                            p: "font-gt-america-standard-regular text-black text-sm lg:text-base leading-relaxed mb-2",
                          }}
                        />
                      </div>
                    )}

                    {tab.cta?.href && (
                      <Link
                        href={tab.cta.href}
                        className="font-gt-america-standard-regular mt-2 inline-block w-fit rounded-full bg-black px-6 py-3 text-sm text-white transition-colors hover:bg-gray-800"
                      >
                        {tab.cta.text || "Learn more"}
                      </Link>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
        </Tabs>
      </div>
    </section>
  );
};

export default TabCareTips;
