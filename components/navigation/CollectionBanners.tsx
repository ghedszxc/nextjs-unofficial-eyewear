import React from "react";
import Image from "next/image";
import RichText from "../RichText";
import Link from "next/link";
import { imageSizes } from "@/lib/image-sizes";
//import { HiOutlineArrowSmRight } from "react-icons/hi";
import { MoveRight } from "lucide-react"

const CollectionBanners = ({
  collectionBanner,
  imageLoaded,
  setImageLoaded,
  activeLabel,
}: {
  collectionBanner: any;
  imageLoaded: boolean;
  setImageLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  activeLabel: string | null;
}) => {
  return (
    <div
      key={collectionBanner.header}
      className="flex h-full cursor-pointer flex-col"
    >
      {/* ===== TITLE + DESCRIPTION — ABOVE the image ===== */}
      <div className="flex grow flex-col gap-1 pb-3">
        <h3 className="font-gt-america-expanded-bold text-lg uppercase text-white">
          {collectionBanner.header}
        </h3>

        {collectionBanner.description?.doc &&
          Array.isArray(collectionBanner.description.doc.content) && (
            <RichText
              doc={{
                type: collectionBanner.description.doc.type,
                content: collectionBanner.description.doc.content,
              }}
              className={{
                p: "font-gt-america-standard-light line-clamp-3 text-sm text-white/80",
              }}
            />
          )}
      </div>

      {/* ===== IMAGE + CTA — two-layer structure ===== */}

      <div className="relative h-64 w-full">
   
        <div
          className={`img-hover-zoom-container absolute inset-0 overflow-hidden transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={collectionBanner.image}
            alt={collectionBanner.header || activeLabel || "Collection banner"}
            fill
            className="img-hover-zoom h-full object-cover"
            onLoad={() => setImageLoaded(true)}
            sizes={imageSizes({ base: "100vw", lg: "33vw" })}
            
          />
        </div>

      
        {collectionBanner.href && (
          <Link
            href={collectionBanner.href}
            className="absolute bottom-4 left-4 z-10"
          >
            <span className="group/cta flex items-center gap-2 font-gt-america-expanded-bold text-sm uppercase text-white">
              <span className="cta-hover-underline">{collectionBanner.ctaLabel || ""}</span>
              {collectionBanner.ctaIcon ? (
                <Image src={collectionBanner.ctaIcon} alt="" width={19} height={11} className="invert transition-transform duration-300 group-hover/cta:-rotate-45" style={{ minWidth: 19, minHeight: 11 }} unoptimized />
              ) : (
                // <HiOutlineArrowSmRight className="text-white transition-transform duration-300 group-hover/cta:-rotate-45" style={{ width: 19, minWidth: 19, height: 11, minHeight: 11 }} />
                <MoveRight className="text-white transition-transform duration-300 group-hover/cta:-rotate-45" style={{ width: 19, minWidth: 19, height: 11, minHeight: 11 }} />
              )}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default CollectionBanners;
