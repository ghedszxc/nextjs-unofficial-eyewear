import { CampaignCard } from "@/components/plp/CampaignCard";
import { ProductCardProduct } from "@/components/plp/ProductCard";
import { SplitCampaignCard } from "@/components/plp/SplitCampaignCard";
import { locales } from "@/constants/locales";
import { getStoryblokRoot } from "@/constants/storyblok";
import { TransformedProducts, VariantGroup } from "@/types/plp";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertPathsToLocaleMap(paths: any) {
  return paths.reduce((acc: any, path: any) => {
    const parts = path.split("/").filter((part: string) => !!part);
    const locale = parts[0];
    if (locale) {
      acc[locale] = path;
    }
    return acc;
  }, {});
}

export function getPath(lang: Language, route: string[] = []) {
  return `${lang}${route.length ? `/${route.join("/")}/` : "/"}`;
}

export const getBaseUrl = () => {
  const isProd = process.env.NODE_ENV !== "development";

  if (isProd && typeof window !== "undefined") {
    return "";
  }

  // Server-side or development: Always use absolute URL
  const hostname = isProd ? process.env.NEXT_PUBLIC_BASE_URL : "localhost:3000";
  const protocol = isProd ? "https://" : "http://";
  return `${protocol}${hostname}`;
};

export const getBaseUrlForServer = () => {
  const isProd = process.env.NODE_ENV !== "development";
  const hostname = isProd ? process.env.NEXT_PUBLIC_BASE_URL : "localhost:3000";
  const protocol = isProd ? "https://" : "http://";
  return `${protocol}${hostname}`;
};

export function extractLocalizedPaths(page: any) {
  const mode = process.env.NEXT_PUBLIC_MODE as "preview" | "public";
  const root = getStoryblokRoot();
  const alternates = page?.alternates
    ?.filter((a: any) => (mode === "public" ? !!a.published : a))
    .map((a: any) => a.full_slug?.replace(root, ""));

  return [page?.full_slug?.replace(root, ""), ...alternates];
}

export function buildHreflang(localizePath: string[], baseUrl: string) {
  const localeMap = convertPathsToLocaleMap(localizePath);

  return locales.reduce(
    (acc, language) => {
      const path = localeMap[language];
      if (path) acc[language] = `${baseUrl}${path}`;
      return acc;
    },
    {} as Record<string, string>
  );
}

export function getHeaderWidgets(data: any) {
  const placements = Array.isArray(data?.content?.placements) ? data.content.placements : [];

  return placements.filter((p: any) => {
    const component = String(p?.component ?? "").toLowerCase();
    return component.startsWith("header_");
  });
}

export function getFooterWidgets(data: any) {
  const placements = Array.isArray(data?.content?.placements) ? data.content.placements : [];

  return placements.filter((p: any) => {
    const component = String(p?.component ?? "").toLowerCase();
    return component.startsWith("footer_");
  });
}

export function getWidgets(data: any) {
  return data?.content?.placements
    ?.filter((p: any) => p?.contents?.length > 0)
    ?.filter((p: any) => Array.from({ length: 15 }, (_, i) => `main_placement_${i + 1}`).includes(p?.component));
}

export function getOriginalWidthHeightImg(imgSrc: string) {
  // Match "<number>x<number>"
  const match = imgSrc.match(/(\d+)x(\d+)/);

  let width;
  let height;

  if (match) {
    width = parseInt(match[1], 10);
    height = parseInt(match[2], 10);
  } else {
    width = 9999;
    height = 9999;
  }

  return {
    width,
    height,
  };
}

export async function getCountryBasedOnIP(): Promise<string> {
  const api = "https://api.country.is";
  const res = await fetch(api, { headers: { Accept: "application/json" } });

  if (!res.ok) throw new Error("Failed to get country based on IP");

  const data = await res.json();

  return data?.country?.toLowerCase() ?? null;
}

export function extractCountryCode(label: string) {
  const match = label.match(/\<(.*?)\>/);
  return match?.[1]?.toLowerCase() ?? null;
}

export function safeJsonParse(input: unknown): any {
  if (typeof input !== "string" || !input.trim()) return {};
  try {
    return JSON.parse(input);
  } catch {
    return {};
  }
}

function getNormalizedAgeGroup(group: string): string | null {
  const trimmed = group.trim();
  const kidsGroup = ["Kids", "Juniors", "Baby"];
  if (kidsGroup.includes(trimmed)) return "Kids";
  // Remove "Adults" and trim; return null if empty or was just "Adults"
  const afterRemoval = trimmed.replace(/\s*Adults\s*/g, "").trim();
  return afterRemoval || null;
}

export function transformStoryblokProducts(products: any[]): TransformedProducts {
  return (products ?? [])
    .map((p) => {
      const variants = p?.content?.related_products ?? [];

      const group: VariantGroup = variants.map((v: any) => {
        const parsed = safeJsonParse(v?.content?.local_settings?.code);
        const attributes = parsed ?? {};
        const rawAgeGroup = String(attributes?.AGE_GROUP ?? "");
        const normalizedAgeGroup = rawAgeGroup.replace(/\s*\([^)]*\)\s*$/, "").trim();
        const finalAgeGroup = getNormalizedAgeGroup(normalizedAgeGroup);
        const images = (v?.content?.media ?? [])
          .map((media: any) => ({
            src: media?.filename ?? "",
            alt: v?.content?.product_code ?? "",
          }))
          .filter((img: { src: string }) => !!img.src);
        
        return {
          name: v?.content?.product_code ?? "",
          status: attributes?.STATUS_N1_26 ?? "",
          age_group: finalAgeGroup,
          polarized: attributes?.POLARIZED?.toUpperCase() === "YES",
          productType:
            attributes?.COLLECTION?.trim() ||
            attributes?.CAMPAIGN_FOOTER_SELECTION?.trim() ||
            attributes?.LENS_TYPE?.trim(),
          images,
        } satisfies ProductCardProduct;
      });

      return group;
    })
    .filter((group) => Array.isArray(group) && group.length > 0);
}

export function getVariantGroup(transformed: TransformedProducts, index: number): VariantGroup | null {
  if (!Array.isArray(transformed)) return null;
  if (index < 0 || index >= transformed.length) return null;
  const group = transformed[index];
  return Array.isArray(group) && group.length ? group : null;
}

export function mapCampaignToCampaignCardProps(c: any): React.ComponentProps<typeof CampaignCard> {
  return {
    layout: "tile",
    imageSrc: c?.image?.src ?? "",
    title: c?.title ?? "",
    description: c?.description,
    ctaLabel: c?.cta ?? "",
    href: c?.url ?? "",
  };
}

export function mapCampaignToSplitCampaignProps(c: any): React.ComponentProps<typeof SplitCampaignCard> {
  return {
    imageSrc: c?.image?.src ?? "",
    title: c?.title ?? "",
    description: c?.description,
    ctaLabel: c?.cta ?? "",
    href: c?.url ?? "",
  };
}

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function buildBreadcrumbs({ lang, route }: { lang: string; route?: string[] }): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: "Home",
      href: `/${lang}`,
    },
  ];

  if (!route?.length) return breadcrumbs;

  let accumulatedPath = `/${lang}`;

  route.forEach((segment, index) => {
    accumulatedPath += `/${segment}`;

    breadcrumbs.push({
      label: segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
      href: index < route.length - 1 ? accumulatedPath : undefined,
    });
  });

  return breadcrumbs;
}
