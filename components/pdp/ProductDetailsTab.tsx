"use client";

import {
  DETAILS_COLUMN_CLASSES,
  DETAILS_COLUMN_WITH_BORDER_CLASSES,
  DETAILS_CONTAINER_CLASSES,
  DETAILS_LABEL_CLASSES,
  DETAILS_ROW_CLASSES,
  DETAILS_VALUE_CLASSES,
} from "./constants";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import { DetailItem } from "./useProductData";
import { useState, useEffect, useCallback } from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import breakpoints from "@/constants/breakpoints";
import { Button } from "../ui/button";

interface ProductDetailsTabProps {
  details: DetailItem[];
  columnsPerRow?: number;
}

function groupDetailsIntoRows(details: DetailItem[], columnsPerRow: number): DetailItem[][] {
  const rows: DetailItem[][] = [];
  for (let i = 0; i < details.length; i += columnsPerRow) {
    rows.push(details.slice(i, i + columnsPerRow));
  }
  return rows;
}

const tooltipIconDark = "/icons/info-tooltip-dark.svg";
const tooltipIconLight = "/icons/info-tooltip.svg";

export function ProductDetailsTab({ details, columnsPerRow = 2 }: ProductDetailsTabProps) {
  if (!details?.length) return null;

  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { current } = useBreakpoint(breakpoints);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close tooltip when tapping outside on mobile
  useEffect(() => {
    if (!isMobile || !openTooltip) return;
    const handleOutsideClick = () => setOpenTooltip(null);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => document.removeEventListener("touchstart", handleOutsideClick);
  }, [isMobile, openTooltip]);

  const handleOpenChange = useCallback(
    (tooltipId: string, open: boolean) => {
      // On mobile, ignore Radix's hover-driven open/close — we control it via touch
      if (isMobile) return;
      setOpenTooltip(open ? tooltipId : null);
    },
    [isMobile]
  );

  const handleTouchTrigger = useCallback((e: React.TouchEvent, tooltipId: string) => {
    e.stopPropagation(); // Prevent the outside-click handler from immediately closing it
    setOpenTooltip((prev) => (prev === tooltipId ? null : tooltipId));
  }, []);

  const detailRows = groupDetailsIntoRows(details, columnsPerRow);

  return (
    <div>
      <div className={DETAILS_CONTAINER_CLASSES}>
        {detailRows.map((row, rowIndex) => (
          <div key={rowIndex} className={DETAILS_ROW_CLASSES}>
            {row.map((detail, colIndex) => {
              const isFirstInRow = colIndex === 0;
              const isFirstRow = rowIndex === 0;
              const hasBorder = !isFirstInRow || !isFirstRow;
              const className = hasBorder ? DETAILS_COLUMN_WITH_BORDER_CLASSES : DETAILS_COLUMN_CLASSES;
              const tooltipId = `${detail.label}-${rowIndex}-${colIndex}`;
              const isOpen = openTooltip === tooltipId;

              return (
                <div key={detail.label} className={className}>
                  <span className={DETAILS_LABEL_CLASSES}>{detail.label}</span>
                  <div className="flex items-center gap-1">
                    <p className={DETAILS_VALUE_CLASSES}>{detail.value}</p>
                    {detail.tooltip && (
                      <Tooltip open={isOpen} onOpenChange={(open) => handleOpenChange(tooltipId, open)}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="flex items-center focus:outline-none"
                            onTouchEnd={(e) => handleTouchTrigger(e, tooltipId)}
                          >
                            <Image
                              src={isOpen ? tooltipIconDark : tooltipIconLight}
                              alt="Info"
                              width={16}
                              height={16}
                              unoptimized
                            />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          align="start"
                          className="flex max-w-[181px] flex-row-reverse gap-4 bg-[#000000CC] p-2 backdrop-blur-sm rounded-sm"
                          sideOffset={current === "laptop" ? -15 : 12}
                          alignOffset={current === "laptop" ? 20 : 0}
                        >
                          {current === "mobile" || current === "tablet" ? (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenTooltip(null);
                              }}
                              variant="ghost"
                              size="icon"
                              className="relative flex h-4 w-4 items-center justify-center focus:outline-none"
                              aria-label="Close tooltip"
                            >
                              <Image src="/icons/tooltip-close.svg" alt="Close Button" fill sizes="16px" unoptimized />
                            </Button>
                          ) : null}
                          <p className="font-gt-america-standard-light font-light! text-[8px] leading-[125%] tracking-[0.08em]">
                            {detail.tooltip}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
