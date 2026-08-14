"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useScroll } from "@/hooks/useScroll";
import { clsx } from "clsx";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import breakpoints from "@/constants/breakpoints";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useNavStore } from "@/lib/store/nav";
import { INavigation } from "@/models/widgets/INavigation";
import NavLinks from "@/components/navigation/NavLinks";
import MobileNav from "@/components/navigation/MobileNav";

const Navigation = ({ NavData, lang }: INavigation) => {
  const headerRef = useRef<HTMLElement>(null);
  const { current } = useBreakpoint(breakpoints);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();
  const isSticky = scrollY > (headerRef?.current?.clientHeight ?? 80);
  const setNavHidden = useNavStore((s) => s.setHidden);

  const TRANSPARENT_NAV_ROUTES = ["/", `/${lang}/`, "/storelist"];
  const HIDE_ON_SCROLL_ROUTES = ["/products", "/products/*", "/collections", "/about", "/storelist"];

  // Submenu
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeMenu = () => setOpenMenu(null);

  // Mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  const path = decodeURI(usePathname() ?? "/");
  const isTransparent = TRANSPARENT_NAV_ROUTES.includes(path);
  const showTransparentNav = isTransparent && !isSticky;
  const isHomepage = path === "/" || path === `/${lang}/`;
  const shouldHideOnScroll = isHomepage || HIDE_ON_SCROLL_ROUTES.some((route) => path.startsWith(route));

  // Show/hide navigation based on FaqTab sticky + scroll direction
  useEffect(() => {
    const handleFaqTabSticky = (e: Event) => {
      const { stuck, scrollDirection } = (e as CustomEvent).detail;
      if (!headerRef.current) return;

      headerRef.current.style.transition = "transform 0.3s ease-in-out, opacity 0.3s ease-out";

      const hidden = stuck && scrollDirection !== "up";
      headerRef.current.style.transform = hidden ? "translateY(-100%) duration-300" : "translateY(0) duration-500";
      headerRef.current.style.opacity = hidden ? "0" : "1";
      setNavHidden(hidden);
    };

    window.addEventListener("faqtab-sticky", handleFaqTabSticky);
    return () => window.removeEventListener("faqtab-sticky", handleFaqTabSticky);
  }, []);

  // Reset navigation transform on route change
  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.style.transform = "translateY(0)";
      headerRef.current.style.opacity = "1";
    }
    setNavHidden(false);
  }, [path, setNavHidden]);

  useEffect(() => {
    if (!shouldHideOnScroll) return;

    const onScroll = () => {
      const currentY = window.scrollY;
      if (!headerRef.current) return;

      // Hide nav when scrolling down (past the header); show it on scroll up or
      // while a menu is open. The sticky FiltersBar in PLP follows `hidden` to
      // keep itself flush with the nav as it slides in and out.
      const hidden = !openMenu && currentY > lastScrollY.current && currentY > headerRef.current.clientHeight;

      headerRef.current.style.transition = "transform 0.2s ease-out, opacity 0.3s ease-in-out";
      headerRef.current.style.transform = hidden ? "translateY(-100%)" : "translateY(0)";
      headerRef.current.style.opacity = hidden ? "0" : "1";
      setNavHidden(hidden);

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [shouldHideOnScroll, openMenu, setNavHidden]);

  useEffect(() => {
    if (openMenu && headerRef.current) {
      headerRef.current.style.transform = "translateY(0)";
      headerRef.current.style.opacity = "1";
      setNavHidden(false);
    }
  }, [openMenu, setNavHidden]);

  return (
    <>
      {/* Nav */}
      <header
        className={clsx(
          "fixed inset-0 z-30 flex h-20 items-center justify-between p-6 lg:h-22 lg:px-8",
          showTransparentNav ? "bg-transparent" : "bg-black text-white",
          isHomepage && !isSticky && "text-white",
          openMenu && "border-b",
          openMenu && "bg-black!"
        )}
        ref={headerRef}
      >
        <div className="relative">
          <Link href="/">
            <Image
              src={showTransparentNav && !isHomepage ? "/icons/unf-logo.svg" : "/icons/unf-logo-white.svg"}
              alt="Unofficial Logo"
              width={current === "mobile" || current === "tablet" ? 136 : 246}
              height={current === "mobile" || current === "tablet" ? 28 : 52}
              unoptimized
              priority
              className="w-[136px] h-[28px] lg:w-[246px] lg:h-[52px]"
            />
          </Link>
        </div>

        <div className="relative hidden lg:block">
          <NavLinks navLinks={NavData ?? []} openMenu={openMenu} setOpenMenu={setOpenMenu} closeMenu={closeMenu} />
        </div>

        <div className="flex items-center justify-start gap-8">
          <Link href={"/storelist"}>
            <h6 className="h6-bold font-gt-america-expanded-bold mt-1 hidden text-sm lg:mt-0 lg:block">STORES</h6>
            <Image
              src="/icons/store-icon.svg"
              alt="Stores"
              width={32}
              height={32}
              className="mr-2 block lg:mr-0 lg:hidden"
              unoptimized
            />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="cursor-pointer lg:hidden"
          >
            <Image
              src="/icons/menu-burger.svg"
              alt="Hamburger Menu"
              width={40}
              height={40}
              unoptimized
              className="invert filter"
            />
          </button>
        </div>
      </header>

      <MobileNav navLinks={NavData ?? []} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
};

export default Navigation;
