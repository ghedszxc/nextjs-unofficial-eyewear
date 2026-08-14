"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
//import { TfiClose } from "react-icons/tfi";
//import { BsChevronLeft } from "react-icons/bs";
import { X } from "lucide-react"
import { ChevronLeft } from "lucide-react"
import { clsx } from "clsx";
import MobileNavList from "./MobileNavList";
import MobileNavPanel from "./MobileNavPanel";
import MobileCollectionsPanel from "./MobileCollectionsPanel";

type NavItem = {
  label: string;
  href?: string;
  children?: any[];
};

type MobileNavProps = {
  navLinks: NavItem[];
  isOpen: boolean;
  onClose: () => void;
};

const MobileNav = ({ navLinks, isOpen, onClose }: MobileNavProps) => {
  const pathname = usePathname();
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const activeItem = activeLabel
    ? navLinks.find((l) => l.label === activeLabel) ?? null
    : null;

  useEffect(() => {
    if (isOpen) {
      onClose();
      setActiveLabel(null);
    }
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) setActiveLabel(null);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleSelect = (label: string) => {
    const item = navLinks.find((l) => l.label === label);
    if (item && item.children && item.children.length > 0) {
      setActiveLabel(label);
    }
  };

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 lg:hidden",
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      )}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      <aside
        className={clsx(
          "absolute inset-0 flex flex-col bg-black",
          isOpen ? "block" : "hidden"
        )}
      >
        <div className="relative flex items-center justify-between border-b-2 border-white px-6 pl-[18px] py-5">
          {activeItem ? (
            <button
              type="button"
              onClick={() => setActiveLabel(null)}
              aria-label="Back to menu"
              className="z-10 flex h-7 cursor-pointer items-center gap-4 text-white"
            >
              {/* <BsChevronLeft className="shrink-0" style={{ width: 24, height: 24 }} /> */}
              <ChevronLeft className="shrink-0" style={{ width: 34, height: 34 }} strokeWidth={1}/>
              <span className="font-gt-america-expanded-bold translate-y-px text-[12px] leading-none uppercase text-white">
                {activeItem.label}
              </span>
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="z-10 ml-auto cursor-pointer text-white"
          >
            {/* <TfiClose size={28} /> */}
            <X size={42} strokeWidth={0.9}/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeItem ? (
            activeItem.label === "Collections" ? (
              <MobileCollectionsPanel item={activeItem} />
            ) : (
              <MobileNavPanel item={activeItem} />
            )
          ) : (
            <MobileNavList navLinks={navLinks} onSelect={handleSelect} />
          )}
        </div>
      </aside>
    </div>
  );
};

export default MobileNav;
