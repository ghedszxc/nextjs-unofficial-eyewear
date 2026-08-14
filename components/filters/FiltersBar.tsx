'use client';

import { forwardRef } from 'react';
import { clsx } from 'clsx';
import ButtonFilters from './ButtonFilters';
import TopFilters from './TopFilters';
import breakpoints from '@/constants/breakpoints';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface FiltersBarProps {
  filters: any[];
  category: string[];
  resultsCount: number;
  onApply?: (selected: any) => void;
  triggerLabel?: string;
  containerClassName?: string;
}

/**
 * Reusable filters bar component used in both PLP and Navigation
 * Provides consistent styling and layout across pages
 */
export const FiltersBar = forwardRef<HTMLDivElement, FiltersBarProps>(
  (
    {
      filters,
      category,
      resultsCount,
      onApply,
      triggerLabel = 'Filters',
      containerClassName,
    },
    ref
  ) => {
    const { current } = useBreakpoint(breakpoints);
    const isMobile = current === "mobile" || current === "tablet";
    const defaultClassName =
      "flex w-full items-center justify-between bg-black px-6 py-4 text-white lg:px-8";

    return (
      <div ref={ref} className={clsx(defaultClassName, containerClassName)}>
        {/* Button Filters - with scroll hint overlay */}
        <div className="relative w-3/4">
          <div className="no-scrollbar scroll overflow-x-auto">
            <ButtonFilters filters={filters} category={category} />
          </div>
          {/* Scroll hint: right-side blur overlay */}
          {isMobile && (
            <div
              className="pointer-events-none absolute inset-y-0 -right-1 w-11 bg-linear-to-l from-black to-transparent"
              style={{
                backdropFilter: "blur(1.5px)",
                maskImage: "linear-gradient(to left, black 0%, black 70%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to left, black 0%, black 70%, transparent 100%)",
              }}
            />
          )}
        </div>

        {/* Top Filters */}
        <div className="flex w-1/4 shrink-0 justify-end">
          <TopFilters
            category={category}
            triggerLabel={triggerLabel}
            resultsCount={resultsCount}
            onApply={(selected) => {
              console.log("APPLY FILTERS:", selected);
              onApply?.(selected);
            }}
            className="font-gt-america-standard-light lg:font-gt-america-expanded-bold cursor-pointer rounded-none text-xs lg:uppercase hover:bg-transparent hover:text-white lg:text-sm"
          />
        </div>
      </div>
    );
  }
);

FiltersBar.displayName = 'FiltersBar';
