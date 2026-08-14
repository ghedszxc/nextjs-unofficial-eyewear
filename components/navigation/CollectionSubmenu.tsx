import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import RichText from "../RichText";
import type { StoryblokRichTextProps } from "@storyblok/react/rsc";
import CollectionBanners from "./CollectionBanners";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { imageSizes } from "@/lib/image-sizes";

type CollectionChild = {
  label: string;
  href: string;
};

export type CollectionGroup = {
  header: string;
  href?: string;
  children?: CollectionChild[];
  image?: string;
  ctaLabel?: string;
  ctaIcon?: string;
  description?: Pick<StoryblokRichTextProps, "doc">;
};

export type CollectionRoot = {
  label: string;
  href?: string;
  children?: CollectionGroup[];
};

type CollectionSubmenuProps = {
  subLinks?: CollectionGroup[] | CollectionRoot;
};

const normalize = (value?: string) => value?.trim().toLowerCase() ?? "";

const CollectionSubmenu = ({ subLinks }: CollectionSubmenuProps) => {
  const groups: CollectionGroup[] = Array.isArray(subLinks)
    ? subLinks
    : (subLinks?.children ?? []);

  // linksGroup = the group that has sub-links (children array with items)
  const linksGroup = groups.find(
    (group): group is CollectionGroup & { children: CollectionChild[] } =>
      Array.isArray(group.children) && group.children.length > 0
  );

  // banners = groups that have an image property (these become visual cards)
  const banners = groups.filter(
    (group): group is CollectionGroup & { image: string } =>
      typeof group.image === "string" && group.image.length > 0
  );

  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Find the banner that matches the currently hovered link
  const activeBanner = activeLabel
    ? banners.find(
        (banner) => normalize(banner.header) === normalize(activeLabel)
      )
    : undefined;

  // Reset image loaded state when the active image changes
  useEffect(() => {
    setImageLoaded(false);
  }, [activeBanner?.image]);

  if (!linksGroup) return null;

  // Dynamic width: banners divide available space equally (max 3)
  const visible = banners.slice(0, 3);
  const widthClasses: Record<number, string> = {
    1: "w-full",
    2: "w-1/2",
    3: "w-1/3",
  };
  const widthClass = widthClasses[visible.length] || "w-1/3";

  return (
    <>
      {/* ===== MODE A: BANNER CARDS ROW ===== */}
      {/* Horizontal flex row of image cards, each with title, description, and CTA */}
      {banners.length > 0 && banners.length <= 3 && (
        <div className="flex flex-row gap-6 px-20 py-10">
          {banners.map((item) => {
            const c = item as CollectionGroup & { image: string };
            return (
              <div
                className={`flex border-[0.5px] border-transparent  ${widthClass}`}
                key={c.header}
              >
                <CollectionBanners
                  collectionBanner={c}
                  imageLoaded={imageLoaded}
                  setImageLoaded={setImageLoaded}
                  activeLabel={activeLabel}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* ===== MODE B: SPLIT VIEW (only if links > 4) ===== */}
      {/* Left half = vertical link list; Right half = preview image/text that changes on hover */}
      {banners.length > 3 && (
        <div className="flex h-[515px] w-full flex-row gap-10 px-10 py-10" onMouseLeave={() => setActiveLabel(null)}>
          {/* === LEFT HALF: LINKS === */}
          <div className="flex flex-1 flex-col gap-6">
            <span className="font-gt-america-expanded-bold text-3xl text-white">
              {linksGroup.header}
            </span>

            <ul
              className="flex flex-col gap-6 py-6"
            >
              {linksGroup.children.map((child) => (
                <li key={child.label} className="cursor-pointer">
                  <Link
                    href={child.href}
                    onMouseEnter={() => setActiveLabel(child.label)}
                    onFocus={() => setActiveLabel(child.label)}
                  >
                    <span
                      className={`font-gt-america-expanded-bold text-lg text-white uppercase  ${
                        activeLabel === child.label
                          ? "underline"
                          : "hover:underline"
                      }`}
                    >
                      {child.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* === RIGHT HALF: PREVIEW IMAGE + TEXT === */}
          <div
            className={`flex w-[500px] shrink-0 flex-col gap-8 transition-opacity duration-300 ${
              activeBanner
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            {activeBanner && (
              <>
                {/* Title + description - ABOVE image */}
                <div className="flex flex-col gap-1">
                  <h3 className="font-gt-america-expanded-bold text-lg uppercase text-white">
                    {activeBanner.header}
                  </h3>

                  {activeBanner.description?.doc &&
                    Array.isArray(
                      activeBanner.description.doc.content
                    ) && (
                      <RichText
                        doc={{
                          type: activeBanner.description.doc.type,
                          content: activeBanner.description.doc.content,
                        }}
                        className={{
                          p: "font-gt-america-standard-light line-clamp-3 text-sm text-white/80",
                        }}
                      />
                    )}
                </div>

                {/* Image as clickable link */}
                <Link href={activeBanner.href || "#"} className="relative block h-[454px]">
                  <div
                    className={`img-hover-zoom-container absolute inset-0 overflow-hidden transition-opacity duration-500 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={activeBanner.image}
                      alt={
                        activeBanner.header ||
                        activeLabel ||
                        "Collection banner"
                      }
                      fill
                      className="img-hover-zoom cursor-pointer object-cover"
                      onLoad={() => setImageLoaded(true)}
                      sizes={imageSizes({ base: "100vw", lg: "33vw" })}
                      
                    />
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CollectionSubmenu;
