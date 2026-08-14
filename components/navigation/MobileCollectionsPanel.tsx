"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
//import { HiOutlineArrowSmRight } from "react-icons/hi";
import { MoveRight } from "lucide-react"
import RichText from "../RichText";
import type { StoryblokRichTextProps } from "@storyblok/react/rsc";
import { imageSizes } from "@/lib/image-sizes";

type CollectionChild = {
  label: string;
  href: string;
};

type CollectionGroup = {
  header: string;
  href?: string;
  image?: string;
  ctaLabel?: string;
  ctaIcon?: string;
  description?: Pick<StoryblokRichTextProps, "doc">;
  children?: CollectionChild[];
};

type CollectionItem = {
  label: string;
  href?: string;
  children?: CollectionGroup[];
};

type MobileCollectionsPanelProps = {
  item: CollectionItem;
};

const MobileCollectionsPanel = ({ item }: MobileCollectionsPanelProps) => {
  const groups = item.children ?? [];
  const cards = groups.filter(
    (group): group is CollectionGroup & { image: string } =>
      typeof group.image === "string" && group.image.length > 0
  );

  if (cards.length === 0) return null;

  return (
    <div className="flex flex-col gap-10 px-6 py-6">
      {cards.map((card) => (
        <div key={card.header} className="flex flex-col gap-4">
          <div className="relative h-[260px] w-full overflow-hidden">
            <Image
              src={card.image}
              alt={card.header || "Collection"}
              fill
              className="object-cover"
              sizes={imageSizes({ base: "100vw" })}
              
            />
          </div>
          <h3 className="font-gt-america-expanded-bold text-[18px] uppercase text-white px-4">
            {card.header}
          </h3>
          {card.description?.doc &&
            Array.isArray(card.description.doc.content) && (
              <RichText
                doc={{
                  type: card.description.doc.type,
                  content: card.description.doc.content,
                }}
                className={{
                  p: "font-gt-america-standard-light text-[20px] leading-[1.5] text-white px-4",
                }}
              />
            )}
          {card.href && (
            <Link
              href={card.href}
              className="mt-1 inline-flex items-center gap-2"
            >
              <span className="font-gt-america-expanded-bold text-[14px] uppercase text-white px-4">
                {card.ctaLabel || "DISCOVER COLLECTION"}
              </span>
              {card.ctaIcon ? (
                <Image
                  src={card.ctaIcon}
                  alt=""
                  width={19}
                  height={11}
                  className="invert"
                  style={{ minWidth: 19, minHeight: 11 }}
                  unoptimized
                />
              ) : (
                // <HiOutlineArrowSmRight
                //   className="text-white"
                //   style={{ width: 19, minWidth: 19, height: 11, minHeight: 11 }}
                // />
                <MoveRight
                  className="text-white"
                  style={{ width: 19, minWidth: 19, height: 11, minHeight: 11 }}
                />
              )}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};
export default MobileCollectionsPanel;
