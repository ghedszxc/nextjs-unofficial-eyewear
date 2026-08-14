"use client";

import breakpoints from "@/constants/breakpoints";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { buildBreadcrumbs, getBaseUrl, transformStoryblokProducts } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";

import { DesktopBlock, FetchStatus, MobileBlock, TransformedProducts } from "@/types/plp";
import { FiltersBar } from "./filters/FiltersBar";

import Banner from "./plp/Banner";
import { Button } from "./ui/button";
import ProductsGrid from "./plp/ProductsGrid";
import { usePLPProgressiveReveal } from "@/hooks/usePLPProgressiveReveal";
import { useNavStore } from "@/lib/store/nav";
import { clsx } from "clsx";
import Breadcrumbs from "./Breadcrumbs";
import { CampaignBanner, CampaignSet } from "@/adapter/PLP/adapter";
import { collectionCatalogs, FILTER_VALUES } from "@/constants/productPrefixQuery";
import BlocksGrid from "./plp/BlocksGrid";

type LayoutBlock =
  | { type: "products"; items: TransformedProducts }
  | { type: "fullRow"; banner: CampaignBanner }
  | { type: "halfWidthTile"; banner: CampaignBanner; products: TransformedProducts };

function buildPLPLayout({ products, banners, columns, isMobile }: any): LayoutBlock[] {
  const blocks: LayoutBlock[] = [];
  const positionKey = isMobile ? "positionMobile" : "positionDesktop";
  const used = new Set<CampaignBanner>();
  let cursor = 0;
  let rowIndex = 1;

  while (cursor < products.length) {
    // 1) Banners that own the entire row (full-width, split) — emit BEFORE the row
    banners
      .filter(
        (b: CampaignBanner) =>
          !used.has(b) && b[positionKey] === rowIndex && (b.layout === "full-width" || b.layout === "split")
      )
      .forEach((b: CampaignBanner) => {
        blocks.push({ type: "fullRow", banner: b });
        used.add(b);
      });

    // 2) Tile row — banner consumes 2 columns; the remaining desktop columns are filled
    //    with products. On mobile (2-col grid) the banner spans the whole row, so no
    //    products sit beside it and they flow into the following rows instead.
    const TILE_COLS = 2;
    const tile = banners.find(
      (b: CampaignBanner) =>
        !used.has(b) &&
        b[positionKey] === rowIndex &&
        (b.layout === "half-width-tile" || b.layout === "single-tile")
    );

    if (tile) {
      const productsInRow = isMobile ? 0 : Math.max(columns - TILE_COLS, 0);
      blocks.push({
        type: "halfWidthTile",
        banner: tile,
        products: products.slice(cursor, cursor + productsInRow),
      });
      used.add(tile);
      cursor += productsInRow;
    } else {
      // 3) Plain product row
      blocks.push({ type: "products", items: products.slice(cursor, cursor + columns) });
      cursor += columns;
    }

    rowIndex++;
  }

  // Tail pass: emit any banner whose position was past the last product row.
  // Without this, banners are silently dropped when filters return fewer rows than the banner's position.
  // banners
  //   .filter((b: CampaignBanner) => !used.has(b))
  //   .sort((a: CampaignBanner, b: CampaignBanner) => a[positionKey] - b[positionKey])
  //   .forEach((b: CampaignBanner) => {
  //     if (b.layout === "half-width-tile" || b.layout === "single-tile") {
  //       blocks.push({ type: "halfWidthTile", banner: b, products: [] });
  //     } else {
  //       blocks.push({ type: "fullRow", banner: b });
  //     }
  //     used.add(b);
  //   });

  return blocks;
}

const DESKTOP_PRODUCT_SLOTS = 16;
const MOBILE_PRODUCT_SLOTS = 12;

function formApiUrl({
  baseUrl,
  lang,
  category,
  searchParams,
}: {
  baseUrl: string;
  lang: string;
  category: string;
  searchParams: URLSearchParams;
}) {
  // For relative paths (baseUrl is empty in production on client), build URL string directly
  // For absolute URLs (baseUrl exists on server or in development), use new URL() constructor
  const isRelativePath = !baseUrl;
  const endpoint = isRelativePath ? "/api/fetchProducts" : `${baseUrl}/api/fetchProducts`;

  if (isRelativePath) {
    // Build relative URL string manually
    const params = new URLSearchParams();
    params.set("lang", lang);
    params.set("category", category);

    // Carry over filter URL params (exclude page since we're progressive revealing)
    for (const [key, value] of searchParams.entries()) {
      if (key === "lang" || key === "category" || key === "page") continue;
      params.set(key, value);
    }

    return `${endpoint}?${params.toString()}`;
  } else {
    // Use new URL() for absolute URLs (development mode)
    const url = new URL(endpoint);
    url.searchParams.set("lang", lang);
    url.searchParams.set("category", category);

    // Carry over filter URL params (exclude page since we're progressive revealing)
    for (const [key, value] of searchParams.entries()) {
      if (key === "lang" || key === "category" || key === "page") continue;
      url.searchParams.set(key, value);
    }

    return url.toString();
  }
}

const PLP = ({
  plpData,
}: {
  plpData: {
    lang: Language;
    category: string[];
    data: any;
  };
}) => {
  const { lang, category, data } = plpData;
  const { productsPlaceholder, filters: buttonFilters, campaigns, viewMoreProducts, banner } = data;
  const mode = process.env.NEXT_PUBLIC_MODE === "public" ? "published" : "draft";

  const searchParams = useSearchParams();
  const router = useRouter();
  const navHidden = useNavStore((s) => s.hidden);

  const [transformedProducts, setTransformedProducts] = useState<TransformedProducts>([]);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const { width } = useBreakpoint(breakpoints);
  const isMobile = width <= 768;
  const hasCampaignLayout = (campaigns?.length ?? 0) > 0;

  const { visibleCount, hasMore, revealMore, reset } = usePLPProgressiveReveal({
    totalProducts: transformedProducts.length,
    isMobile,
    desktopPageSize: DESKTOP_PRODUCT_SLOTS,
    mobilePageSize: MOBILE_PRODUCT_SLOTS,
    hasCampaignLayout,
  });

  const filterQueryString = useMemo(() => {
    // Create a string without the page param to detect filter changes
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    return params.toString();
  }, [searchParams]);

  useEffect(() => {
    // Reset progressive reveal when filters change
    reset();
  }, [filterQueryString, reset]);

  const productsForGrid = useMemo(() => {
    return transformedProducts.slice(0, visibleCount);
  }, [transformedProducts, visibleCount]);

  const filterMatch = category.find((seg) => FILTER_VALUES.includes(seg as any));
  const collectionMatch = collectionCatalogs.find((c) => category.includes(c.collectionRoute));
  const activeFilter = filterMatch ?? collectionMatch?.collectionRoute ?? "default";

  const activeBanners =
    campaigns?.find((s: CampaignSet) => s.scope.includes(activeFilter))?.banners ??
    campaigns?.find((s: CampaignSet) => s.scope.includes("default"))?.banners ??
    [];

  const layout = useMemo<any>(
    () => buildPLPLayout({ products: productsForGrid, banners: activeBanners, columns: isMobile ? 2 : 4, isMobile }),
    [productsForGrid, activeBanners, isMobile]
  );

  // Calculate expected skeleton slots based on current breakpoint and visible products
  const expectedSlotCount = Math.min(
    visibleCount || (isMobile ? MOBILE_PRODUCT_SLOTS : DESKTOP_PRODUCT_SLOTS),
    isMobile ? MOBILE_PRODUCT_SLOTS : DESKTOP_PRODUCT_SLOTS
  );

  const fetchUrl = useMemo(() => {
    return formApiUrl({
      baseUrl: getBaseUrl(),
      lang: String(lang),
      category: String(category.join(",")),
      searchParams,
    });
  }, [lang, category, filterQueryString]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAllProducts() {
      try {
        setStatus("loading");
        setErrorMsg("");

        const res = await fetch(fetchUrl, {
          method: "GET",
          signal: controller.signal,
          credentials: "include",
          headers: { Accept: "application/json" },
          next: mode === "published" ? { revalidate: 15 } : undefined,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Failed to fetch products (HTTP ${res.status})`);
        }

        const json = await res.json();
        const products = json?.data ?? [];

        // Warn if fetching a large dataset (consider pagination for > 500)
        if (products.length > 500) {
          console.warn(
            `[PLP] ${products.length} products fetched. Consider server-side pagination for large datasets.`
          );
        }

        setTransformedProducts(transformStoryblokProducts(products));
        setStatus("ready");
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setStatus("error");
        setErrorMsg(err?.message || "Something went wrong while fetching products.");
      }
    }

    fetchAllProducts();
    return () => controller.abort();
  }, [fetchUrl, mode]);

  // HANDLER: View More Products
  const handleViewMore = useCallback(() => {
    revealMore();
    // Optional: Scroll to grid for better UX
    // window.scrollTo({ top: gridRef.current?.offsetTop, behavior: "smooth" });
  }, [revealMore]);

  return (
    <>
      <div className="bg-black pt-20 lg:pt-28">
        <div className="flex flex-col-reverse justify-between gap-2 px-6 pt-2 pb-4 text-white lg:flex-row lg:gap-4 lg:px-8 lg:py-4">
          {/* Header */}
          <div className="flex gap-2">
            <h1 className="font-gt-america-expanded-bold m-0 text-sm uppercase lg:text-xl">{productsPlaceholder}</h1>
            <h4>
              <sup className="font-gt-america-standard-light text-xs font-normal lg:text-sm">
                {status === "loading" || status === "idle" ? "…" : transformedProducts.length}
              </sup>
            </h4>
          </div>
          {status === "error" ? <p className="text-sm text-red-600">{errorMsg}</p> : null}
          <div>
            <Breadcrumbs
              items={buildBreadcrumbs({
                lang,
                route: category,
              })}
            />
          </div>
        </div>
      </div>

      {/* Filters — single sticky bar. `top` follows the nav: flush below it when
          the nav is visible, snapped to the top when the nav hides on scroll. The
          transition-[top] keeps the two moving as one continuous unit. */}
      <FiltersBar
        filters={buttonFilters}
        category={category}
        resultsCount={transformedProducts.length}
        onApply={(selected) => {
          console.log("APPLY FILTERS:", selected);
        }}
        containerClassName={clsx(
          "sticky z-20 transition-[top] duration-300 ease-in-out",
          navHidden ? "top-0" : "top-20 lg:top-22"
        )}
      />

      {/* Products Grid with Campaign Banners */}
      {campaigns?.length > 0 ? (
        <BlocksGrid
          blocks={layout}
          status={status}
          slotCount={expectedSlotCount}
          className={`w-full ${!hasMore ? "pb-20" : ""}`}
        />
      ) : (
        <ProductsGrid
          transformedProducts={productsForGrid}
          status={status}
          slotCount={productsForGrid.length}
          className={`w-full ${!hasMore ? "pb-20" : ""}`}
        />
      )}

      {/* View More Button */}
      {hasMore && (
        <div className="flex w-full items-center px-6 py-12 lg:justify-center lg:py-20">
          <Button
            variant={null}
            className="font-gt-america-expanded-bold w-full cursor-pointer justify-center rounded-none border border-black p-6 text-sm uppercase disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
            disabled={status === "loading"}
            onClick={handleViewMore}
          >
            {viewMoreProducts}
          </Button>
        </div>
      )}

      <Banner banner={banner} />
    </>
  );
};

export default PLP;
