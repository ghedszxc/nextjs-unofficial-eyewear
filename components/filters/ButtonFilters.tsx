"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATEGORY_FILTERS, FILTER_VALUES, isCollectionFilter } from "@/constants/productPrefixQuery";

type FilterItem = {
  name: string;
  link: string;
  value: string;
};

const ButtonFilters = ({ filters, category }: { filters: FilterItem[]; category: string[] }) => {
  const searchParams = useSearchParams();

  /**
   * Find the current active filter in the URL
   * - Scans category array for any known filter value
   * - Returns the filter value if found, otherwise null
   */
  const getCurrentActiveFilter = (): string | null => {
    for (const segment of category) {
      if (FILTER_VALUES.includes(segment as any)) {
        return segment;
      }
    }
    return null;
  };

  const buildFilterLink = (filterValue: string): string => {
    const isCollection = isCollectionFilter(filterValue);

    if (isCollection) {
      return `/products/${filterValue}`;
    }

    const currentFilter = getCurrentActiveFilter();
    let basePath: string;

    // "View All" always returns to base category
    if (filterValue === "prod") {
      // Remove all filters, keep only category (e.g., /products/eyeglasses)
      const baseCategory = category.filter((seg) => !FILTER_VALUES.includes(seg as any));
      basePath = `/${baseCategory.join("/")}`;
    } else if (currentFilter === filterValue) {
      // If clicking the same filter, toggle it off (remove it)
      const filtered = category.filter((seg) => seg !== filterValue);
      basePath = `/${filtered.join("/")}`;
    } else if (currentFilter && currentFilter !== "prod") {
      // If a different filter is active, REPLACE it
      const updated = category.map((seg) => (seg === currentFilter ? filterValue : seg));
      basePath = `/${updated.join("/")}`;
    } else {
      // No filter active: append the new filter
      basePath = `/${category.join("/")}/${filterValue}`;
    }

    // PRESERVE existing TopFilters query parameters
    const params = new URLSearchParams(searchParams);
    const queryString = params.toString();

    // Combine path with preserved query params
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const isFilterActive = (filterValue: string): boolean => {
    const isCollection = isCollectionFilter(filterValue);

    if (isCollection) {
      // For collections, active = current URL matches the collection route
      return category?.[0] === filterValue || category?.[1] === filterValue;
    }

    // Attribute filter logic
    if (filterValue === "prod") {
      // "View All" is active when no filter is selected
      return !getCurrentActiveFilter();
    }
    return getCurrentActiveFilter() === filterValue;
  };

  return (
    <div className="flex w-full gap-8">
      {filters.map((f, i) => {
        const isActive = isFilterActive(f.value);

        return (
          <Button
            key={f.name}
            variant={null}
            className={cn(
              "font-gt-america-standard-light h-auto w-fit cursor-pointer p-0 text-base hover:underline",
              isActive && "underline underline-offset-2",
              i === filters.length - 1 ? "pr-10" : "pr-0" //Add right padding to the last item for better spacing
            )}
            asChild
          >
            <Link href={buildFilterLink(f.value)}>{f.name}</Link>
          </Button>
        );
      })}
    </div>
  );
};

export default ButtonFilters;
