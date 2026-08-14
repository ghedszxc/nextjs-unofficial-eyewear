"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { extractCountryCode, getCountryBasedOnIP } from "@/lib/utils";
import { IStoreList } from "@/models/widgets/IStoreList";
import { Locate, CircleX, MoveRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import breakpoints from "@/constants/breakpoints";
import { useBreakpoint } from "@/hooks/useBreakpoint";

type Status = "idle" | "detecting" | "ready" | "error";

const StoreList = (
  {
    suggestedText,
    storesAvailableText,
    visitStoreText,
    visitTextAccordion,
    searchPlaceholderText,
    searchArrowTextDsk,
    searchArrowTextMob,
    items
  }: IStoreList) => {
  const [status, setStatus] = useState<Status>("idle");
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>("Asia");
  const [search, setSearch] = useState("");
  const [isOutside, setIsOutside] = useState(false);
  const [hasScrolledPastHeader, setHasScrolledPastHeader] = useState(false);
  const [isTabClicked, setIsTabClicked] = useState(false);
  const [isScrollingNow, setIsScrollingNow] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const lastScrollY = useRef(0);
  const scrollIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickFallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isManualScrolling = useRef(false);

  const { width } = useBreakpoint(breakpoints);
  const isMobile = width <= 768;

  console.log(visitTextAccordion);


  const categorized = useMemo(() => items.reduce((acc: RegionGroup[], item: any) => {
    let region = acc.find(r => r.region === item.region);
    if (!region) {
      region = { region: item.region, countries: [] };
      acc.push(region);
    }

    let country = region.countries.find(c => c.country === item.country);
    if (!country) {
      country = { country: item.country, stores: [] };
      region.countries.push(country);
    }

    country.stores.push({
      name: item.store,
      url: item.url,
      icon: { url: item.logo.url, alt: item.logo.alt },
      iconColor: item.logoColor
    });

    return acc;
  }, []), [items]);

  /* Auto-detect on modal open using IP */
  useEffect(() => {

    // If already cached country code, use it
    const cached = localStorage.getItem("countryCode");
    if (cached) {
      setCountryCode(cached);
      setStatus("ready");
      return;
    }

    const detectCountry = async () => {
      try {
        setStatus("detecting");

        const code = await getCountryBasedOnIP();

        if (!code) throw new Error("No country returned");

        setCountryCode(code);
        localStorage.setItem("countryCode", code);
        setStatus("ready");
      } catch {
        setStatus("error");
        setErrorMsg("Failed to detect your country. Please select manually.");
      }
    };

    detectCountry();
  }, []);

  useEffect(() => {
    const element = document.querySelector("header");

    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsOutside(!entry.isIntersecting);
    }, { threshold: 1.0 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = document.querySelector("header");
    const headerHeight = element?.clientHeight ?? (window.innerWidth >= 1024 ? 88 : 80);

    const onScroll = () => {
      setHasScrolledPastHeader(window.scrollY > headerHeight);

      // Real scrolling is happening, so the idle-debounce below is enough
      // to clear click state whenever it settles, no matter how long the
      // animation runs. Disarm the "target already in view" safety net now
      // so it can't fire mid-animation on long scrolls and flip the
      // background early.
      if (clickFallbackTimer.current) {
        clearTimeout(clickFallbackTimer.current);
        clickFallbackTimer.current = null;
      }

      setIsScrollingNow(true);
      if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);
      scrollIdleTimer.current = setTimeout(() => {
        setIsScrollingNow(false);
        isManualScrolling.current = false;
        setIsTabClicked(false);
      }, 150);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!isOutside) return;

    const onScroll = () => {
      const currentY = window.scrollY;
      setScrollDirection(currentY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOutside]);

  /* Scrollspy: highlight the tab whose region section is entering the top
     band of the viewport. Mirrors down-scroll behavior in FaqTab. */
  useEffect(() => {
    if (search) return;
    if (isOutside && scrollDirection === "up") return;
    if (!categorized || categorized.length === 0) return;

    const anchorTargets = categorized
      .map((region) => ({
        region: region.region,
        element: document.getElementById(region.region),
      }))
      .filter(
        (item): item is { region: string; element: HTMLElement } =>
          item.element !== null
      );

    if (anchorTargets.length === 0) return;

    const navbarHeight = window.innerWidth >= 1024 ? 88 : 80;
    const tabBarHeight = tabBarRef.current?.offsetHeight ?? 90;
    const topOffset = navbarHeight + tabBarHeight;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = anchorTargets.find(
              (item) => item.element === entry.target
            );
            if (match && !isManualScrolling.current) setSelectedRegion(match.region);
          }
        });
      },
      { rootMargin: `-${topOffset}px 0px -80% 0px` }
    );

    anchorTargets.forEach(({ element }) => observer.observe(element));

    return () => observer.disconnect();
  }, [categorized, isOutside, scrollDirection, search]);

  /* Scrollspy: while scrolling up, poll positions so the tab reflects the
     region currently under the sticky bar. Mirrors up-scroll behavior in FaqTab. */
  useEffect(() => {
    if (!isOutside || scrollDirection !== "up" || search) return;
    if (!categorized || categorized.length === 0) return;

    const navbarHeight = window.innerWidth >= 1024 ? 88 : 80;
    const tabBarHeight = tabBarRef.current?.offsetHeight ?? 90;
    const stickyBottom = navbarHeight + tabBarHeight;

    const anchorTargets = categorized
      .map((region) => ({
        region: region.region,
        element: document.getElementById(region.region),
      }))
      .filter(
        (item): item is { region: string; element: HTMLElement } =>
          item.element !== null
      );

    if (anchorTargets.length === 0) return;

    const onScroll = () => {
      if (isManualScrolling.current) return;

      let activeRegion = anchorTargets[0].region;
      let found = false;
      for (const { region, element } of anchorTargets) {
        const top = element.getBoundingClientRect().top;
        if (top >= stickyBottom && top <= window.innerHeight) {
          activeRegion = region;
          found = true;
          break;
        }
      }
      if (!found) {
        for (const { region, element } of anchorTargets) {
          if (element.getBoundingClientRect().top <= stickyBottom) {
            activeRegion = region;
          }
        }
      }

      setSelectedRegion(activeRegion);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOutside, scrollDirection, categorized, search]);

  /* Keep the active tab centered in view on mobile, where the tab bar
     scrolls horizontally. Mirrors FaqTab's active-tab centering. */
  useEffect(() => {
    if (window.innerWidth >= 1024) return;

    const container = tabContainerRef.current;
    const activeIndex = categorized.findIndex((region) => region.region === selectedRegion);
    const activeButton = tabRefs.current[activeIndex];
    if (!container || !activeButton) return;

    const scrollLeft =
      activeButton.offsetLeft -
      container.offsetLeft -
      container.clientWidth / 2 +
      activeButton.offsetWidth / 2;

    container.scrollTo({ left: scrollLeft, behavior: "smooth" });
  }, [selectedRegion, categorized]);

  /* Find suggested country */
  const suggestedCountry = useMemo(() => {
    if (!countryCode) return null;

    for (const region of categorized) {
      for (const country of region.countries) {
        if (extractCountryCode(country.country) === countryCode) {
          return country;
        }
      }
    }
    return null;
  }, [countryCode]);

  const toggleRegion = (region: string) => {
    setSelectedRegion(region);
    setIsTabClicked(true);
    isManualScrolling.current = true;

    if (clickFallbackTimer.current) clearTimeout(clickFallbackTimer.current);

    const element = document.getElementById(region);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

    // Safety net only: covers the case where the target is already in view
    // and no scroll event ever fires to trigger the idle-debounce clear above.
    clickFallbackTimer.current = setTimeout(() => {
      isManualScrolling.current = false;
      setIsTabClicked(false);
    }, 1200);
  }

  const getCountryNameParts = (countryStr: string): string[] => {
    const base = countryStr.split("<")[0];
    const parts = base.split("|").map((part) => part.trim());
    return parts.length > 1 && parts[0] === parts[1] ? [parts[0]] : parts;
  };

  const formatCountryLabel = (countryStr: string) => getCountryNameParts(countryStr).join(" | ");

  //search function
  const handleChange = (event: any) => {
    const value = event.target.value;
    setSearch(value);
  };

  const clear = () => {
    const inputElement = document.getElementById('search') as HTMLInputElement;
    const mobileInputElement = document.getElementById('searchMobile') as HTMLInputElement; //searchMobile
    if (inputElement) {
      inputElement.value = '';
    };
    if (mobileInputElement) {
      mobileInputElement.value = '';
    };
    setSearch("");
  }

  // const renderSearchResult = (items: RegionGroup[], searchTerm: string) => {
  //   const allCountries: CountryGroup[] = [];
  //   items.map((region) => {
  //     region.countries.map((country) => {
  //       allCountries.push(country);
  //     })
  //   });

  //   if (allCountries.filter(country => country.country.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())).length == 0) {
  //     return <div className="font-gt-america-standard-light text-[24px] pt-[56px] px-[24px]">No results found</div>
  //   } else {
  //     return (
  //       allCountries.filter(
  //         country => country.country.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()))
  //         .map((country) => (
  //           <AccordionItem key={country.country} value={country.country}>
  //             <AccordionTrigger className="text-lg font-bold !text-black cursor-pointer hover:no-underline [&>svg]:text-black">
  //               <div>
  //                 {isMobile ?
  //                   <div>
  //                     <p className="font-gt-america-standard-light text-[18px]">{country.country.split("<")[0].split("|")[0]}</p>
  //                     <p className="font-gt-america-standard-light text-[18px]">{country.country.split("<")[0].split("|")[1]}</p>
  //                   </div>
  //                   :
  //                   <p className="font-gt-america-standard-light text-[24px]">{country.country.split("<")[0]}</p>
  //                 }
  //                 <span className="font-gt-america-standard-light text-sm">
  //                   {country.stores.length} {country.stores.length > 1 ? storesAvailableText.split("|")[1] : storesAvailableText.split("|")[0]}
  //                 </span>
  //               </div>
  //             </AccordionTrigger>
  //             <AccordionContent className="space-y-4">
  //               <CountryCard
  //                 key={country.country}
  //                 country={country.country}
  //                 stores={country.stores}
  //                 storesAvailableText={storesAvailableText}
  //                 visitStoreText={visitStoreText}
  //                 visitTextAccordion={visitTextAccordion}
  //                 onSelect={() => {
  //                   const code = extractCountryCode(country.country);
  //                   if (!code) return;
  //                   setCountryCode(code);
  //                   localStorage.setItem("countryCode", code);
  //                   setStatus("ready");
  //                   setErrorMsg(null);
  //                 }}
  //               />
  //             </AccordionContent>
  //           </AccordionItem>
  //         ))
  //     )
  //   }
  // }

  const renderSearchResult = (items: RegionGroup[], searchTerm: string) => {
    const hasMatch = () => {
      //return items.map((region) => { region.countries.filter(country => country.country.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())).length === 0 })
      return items.some(region => region.countries.filter(country => country.country.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())));
    }

    if (!hasMatch()) {
      return <div className="font-gt-america-standard-light text-[24px] pt-[56px] px-[24px]">No results found</div>
    } else {
      return (
        items.map((region, index) => (
          <div key={index} className="mb-[80px] lg:mb-[40px] scroll-m-[174px]" id={region.region}>
            {region.countries.filter(country => country.country.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())).length !== 0 &&
              <div className="font-gt-america-expanded-bold font-bold uppercase text-[24px] md:text-[30px] lg:text-[30px] mb-[32px]">{region.region}</div>
            }
            {region.countries.filter(country => country.country.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())).map((country) => (
              <AccordionItem key={country.country} value={country.country} className="border-b-[0.5px] border-[#000000] mt-[16px]">
                <AccordionTrigger className="!text-black cursor-pointer hover:no-underline [&>svg]:text-black" chevronClassName="stroke-1">
                  <div>
                    <p className={`font-gt-america-standard-light font-light ${isMobile ? "text-[20px]" : "text-[30px]"}`}>
                      {formatCountryLabel(country.country)}
                    </p>
                    {/* <span className="font-gt-america-standard-light text-sm">
                          {country.stores.length} {country.stores.length > 1 ? storesAvailableText.split("|")[1] : storesAvailableText.split("|")[0]}
                        </span> */}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <CountryCard
                    key={country.country}
                    country={country.country}
                    stores={country.stores}
                    storesAvailableText={storesAvailableText}
                    visitStoreText={visitStoreText}
                    visitTextAccordion={visitTextAccordion}
                    onSelect={() => {
                      const code = extractCountryCode(country.country);
                      if (!code) return;
                      setCountryCode(code);
                      localStorage.setItem("countryCode", code);
                      setStatus("ready");
                      setErrorMsg(null);
                    }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </div>
        ))
      )
    }
  }

  return (
    <div className="space-y-4 lg:pb-6">
      <div className="bg-black">
        {/* Loading / status */}
        {!countryCode && (
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <Locate className="h-4 w-4 animate-pulse" />
            {status === "detecting" && "Detecting your country…"}
            {status === "error" && "An error occurred"}
          </p>
        )}

        {errorMsg && <p className="text-destructive text-sm">{errorMsg}</p>}

        {/* Suggested */}
        {suggestedCountry && (
          <div className="px-[24px] py-[40px] lg:mx-[80px] lg:px-0">
            <div className="font-gt-america-expanded-bold flex items-center gap-2 mb-[24px] text-4xl text-white font-medium">
              {suggestedText}
            </div>

            <CountryCard
              country={suggestedCountry.country}
              stores={suggestedCountry.stores}
              storesAvailableText={storesAvailableText}
              visitStoreText={visitStoreText}
              visitTextAccordion={visitTextAccordion}
              isSuggested
            />
          </div>
        )}
      </div>

      {/*Search bar*/}
      <div className="flex px-[24px] mt-6 mb-[18px] lg:mx-[80px] lg:px-0">
        {/* desktop */}
        <div className="relative flex-1 hidden lg:block">
          <input
            id="search"
            type="text"
            placeholder={searchPlaceholderText}
            className="inline px-4 py-2 border border-black rounded-full focus:outline-none w-full"
            onChange={handleChange}
          />
          {!search &&
            <div className="flex absolute top-3 right-5">
              <span className="font-gt-america-expanded-bold text-[14px]">{searchArrowTextDsk}</span>
              <MoveRight className="w-[20px] h-[20px] ms-[10px] stroke-1" />
            </div>
          }
        </div>

        {/* mobile */}
        <div className="relative flex-1 block lg:hidden">
          <input
            id="searchMobile"
            type="text"
            placeholder=""
            className="inline px-4 py-2 border border-black rounded-full focus:outline-none w-full"
            onChange={handleChange}
          />
          {!search &&
            <div className="flex absolute top-3 left-5">
              <span className="font-gt-america-expanded-bold text-[14px]">{searchArrowTextMob}</span>
              <MoveRight className="w-[20px] h-[20px] ms-[10px] stroke-1" />
            </div>
          }
        </div>

        {search &&
          <button onClick={() => clear()}>
            <CircleX className="w-[36px] h-[36px] ms-[24px] stroke-1" />
          </button>
        }
      </div>

      {/* Regions */}
      {!search &&
        <div ref={tabBarRef} className={`sticky z-1 ${isOutside ? "top-[0] lg:top-[0]" : "top-[80px] lg:top-[88px]"} ${isTabClicked ? "bg-white" : hasScrolledPastHeader ? "bg-white/40" : "bg-white"} ${hasScrolledPastHeader ? "border-b border-black" : ""} transition-all duration-90 backdrop-blur-sm`}>
          <div ref={tabContainerRef} className="pt-[24px] pb-[24px] mb-[24px] z-15 h-[90px] flex overflow-x-scroll px-[24px] gap-[24px] mb-[24px] lg:overflow-x-auto lg:mx-[80px] lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categorized.map((region, index) => (
              <button
                ref={(el) => { tabRefs.current[index] = el; }}
                onClick={() => toggleRegion(region.region)}
                className={`h-[46px] text-[18px] whitespace-nowrap border border-black rounded-[100px] pt-[8px] pb-[8px] ps-[32px] pe-[32px] hover:bg-[#0000004D] hover:text-black ${region.region == selectedRegion ? "bg-black text-white" : "bg-white text-black"} lg:h-[43px]`}
                key={index}
              >
                <span>{region.region}</span>
              </button>
            ))}
          </div>
        </div>
      }

      {/* Search result */}
      {search &&
        <div className="px-[24px] pb-[32px] lg:mx-[80px] lg:px-0 lg:pb-[80px]">
          <Accordion type="single" collapsible className="w-full">
            {renderSearchResult(categorized, search)}
          </Accordion>
        </div>
      }

      {/* Default */}
      {!search &&
        <div className="px-[24px] pb-[32px] mt-[32px] lg:mt-[40px] lg:mx-[80px] lg:px-0 lg:pb-[80px]">
          <Accordion type="single" collapsible className="w-full">
            {categorized.map((region, index) => (
              <div key={index} className="mb-[80px] lg:mb-[40px] scroll-m-[174px]" id={region.region}>
                <div className="font-gt-america-expanded-bold font-bold uppercase text-[24px] lg:text-[30px] mb-[32px]">{region.region}</div>
                {region.countries.map((country) => (
                  <AccordionItem key={country.country} value={country.country} className="border-b-[0.5px] border-[#000000] mt-[16px]">
                    <AccordionTrigger className="!text-black cursor-pointer hover:no-underline [&>svg]:text-black" chevronClassName="stroke-1">
                      <div>
                        <p className={`font-gt-america-standard-light font-light ${isMobile ? "text-[20px]" : "text-[30px]"}`}>
                          {formatCountryLabel(country.country)}
                        </p>
                        {/* <span className="font-gt-america-standard-light text-sm">
                          {country.stores.length} {country.stores.length > 1 ? storesAvailableText.split("|")[1] : storesAvailableText.split("|")[0]}
                        </span> */}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <CountryCard
                        key={country.country}
                        country={country.country}
                        stores={country.stores}
                        storesAvailableText={storesAvailableText}
                        visitStoreText={visitStoreText}
                        visitTextAccordion={visitTextAccordion}
                        onSelect={() => {
                          const code = extractCountryCode(country.country);
                          if (!code) return;
                          setCountryCode(code);
                          localStorage.setItem("countryCode", code);
                          setStatus("ready");
                          setErrorMsg(null);
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </div>
            ))}
          </Accordion>
        </div>
      }
    </div>
  );
};

export default StoreList;

const CountryCard = ({
  country,
  stores,
  storesAvailableText,
  visitStoreText,
  visitTextAccordion,
  onSelect,
  isSuggested
}: {
  country: string;
  stores: Store[];
  storesAvailableText: string;
  visitStoreText: string;
  visitTextAccordion: string,
  onSelect?: () => void;
  isSuggested?: boolean
}) => {
  return (
    <div
      className={`space-y-3 ${isSuggested ? "bg-black text-white" : "bg-white text-black"}`}
      onClick={onSelect}
    >
      {isSuggested &&
        <div className="space-y-2">
          <span className={`font-gt-america-expanded-bold inline-block me-[80px] ${isSuggested ? "text-lg" : "font-bold text-base"}`}>
            {country.split("<")[0]}
          </span>
          <span className="inline-block font-gt-america-standard-light text-sm">
            {stores.length} {stores.length > 1 ? storesAvailableText.split("|")[1] : storesAvailableText.split("|")[0]}
          </span>
        </div>
      }

      <div className="flex flex-col gap-[16px] space-y-2 w-full lg:flex-row">
        {stores.map((store, index) => (
          <div key={index} className={`flex items-center justify-center border rounded-sm w-[99%] px-3 py-2 ${isSuggested ? "border-white h-[96px] lg:w-auto lg:h-[112px]" : "border-black bg-black h-[112px] lg:w-[308px] text-white"}`}>
            <Button size="sm" className={`p-4 bg-transparent hover:bg-transparent`} asChild>
              <Link
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {isSuggested ?
                  <span className="me-[16px] font-gt-america-standard-light text-[12px]">{visitStoreText}</span>
                  :
                  <span className="me-[16px] font-gt-america-standard-light text-[12px]">{visitTextAccordion}</span>
                }
                {store.icon?.url ?
                  <span style={{ backgroundColor: store.iconColor }} className="px-[5px]"><Image src={store.icon?.url} alt={store.icon?.alt} width={150} height={32}  /></span>
                  :
                  <span className="font-gt-america-standard-light text-base font-bold">{store.name}</span>
                }
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
