import { getStoryblokRoot } from "@/constants/storyblok";
import { api } from "@/lib/api";
import { safeJsonParse } from "@/lib/utils";
import { StoryblokRichTextProps } from "@storyblok/react/rsc";

type BannerLayout = "full-width" | "split" | "single-tile" | "half-width-tile";

export type CampaignBanner = {
  layout: BannerLayout;
  positionDesktop: number; // 1-indexed row to insert AFTER
  positionMobile: number;
  side?: "left" | "right" | "center";
  desktopImage: { url: string; alt?: string };
  mobileImage: { url: string; alt?: string };
  title: string;
  description?: Pick<StoryblokRichTextProps, "doc">;
  cta?: { label: string; url: string };
  backgroundColor?: string;
  reversed?: boolean;
};

export type CampaignSet = {
  scope: string;
  banners: CampaignBanner[];
};

type Story = {
  uuid: string;
  name?: string;
  slug?: string;
  full_slug?: string;
  content?: any;
};

const getStoriesByUuids = async (uuids: string[], lang: Language): Promise<Story[] | null> => {
  if (!uuids.length) return [];
  const { success, data } = await api.cms.stories({
    by_uuids_ordered: uuids.join(","),
    language: lang,
  });
  return success && Array.isArray(data) ? (data as Story[]) : null;
};

const itemUuids = (story: Story): string[] => {
  return Array.isArray(story?.content?.items) ? story.content.items.filter((x: any) => typeof x === "string") : [];
};

const PLPAdapter = async (widgets: any, lang: Language) => {
  const productsPlaceholder = widgets?.find((widget: any) => widget?.contents?.[0]?.name === "01_Products");
  const filters = widgets?.find((widget: any) => widget?.contents?.[0]?.name === "02_TopFilters");
  const campaigns = widgets?.find((widget: any) => widget?.contents?.[0]?.name === "03_Campaigns");
  const viewMoreProducts = widgets?.find((widget: any) => widget?.contents?.[0]?.name === "04_ViewMoreProducts");
  const banner = widgets?.find((widget: any) => widget?.contents?.[0]?.name === "05_Banner");

  let campaignStories: Story[] = [];
  if (campaigns) {
    const campaignUuids = itemUuids(campaigns.contents?.[0] ?? {});
    if (campaignUuids.length) {
      const fetched = await getStoriesByUuids(campaignUuids, lang);
      if (fetched) {
        campaignStories = fetched;
      } else {
        console.warn("Failed to fetch campaign stories for PLP — proceeding without campaigns");
      }
    }
  }

  const PLPData = {
    productsPlaceholder: productsPlaceholder?.contents[0]?.content?.title || "",
    filters: safeJsonParse(filters?.contents[0]?.content?.local_settings?.code)?.filters || [],

    // Resolve campaigns using its UUIDs
    campaigns: await Promise.all(
      campaignStories.map(async (story: Story) => {
        const bannerUuids = itemUuids(story);
        const bannerStories = await getStoriesByUuids(bannerUuids, lang);
        const campaignSet: CampaignSet = {
          scope: story?.content?.collection_subtitle || "default",
          banners:
            (await Promise.all(
              bannerStories?.map(async (b) => {
                const localSettings = safeJsonParse(b?.content?.local_settings?.code) || {};
                const getCtaUrl = async (ctaTarget: any) => {
                  if (!ctaTarget) return "";
                  const targetStory = await getStoriesByUuids(ctaTarget, lang);
                  const targetSlug = targetStory?.[0]?.full_slug || "";
                  return targetSlug ? targetSlug.replace(getStoryblokRoot() + `/${lang}`, "") : "";
                };

                const normalizeLayoutType = (layout: string): BannerLayout => {
                  if (layout?.includes("half-width-tile")) return "half-width-tile";
                  if (layout?.includes("single-tile")) return "single-tile";
                  if (layout?.includes("tile")) return "single-tile"; // fallback
                  if (layout?.includes("split")) return "split";
                  return "full-width";
                };

                return {
                  layout: normalizeLayoutType(b?.content?.layout_variant),
                  positionDesktop: localSettings?.position_desktop || 1,
                  positionMobile: localSettings?.position_mobile || 1,
                  side: b?.content?.layout_variant?.includes("left")
                    ? "left"
                    : b?.content?.layout_variant?.includes("right")
                      ? "right"
                      : b?.content?.layout_variant?.includes("center")
                        ? "center"
                        : localSettings?.side
                          ? localSettings.side.toLowerCase()
                          : undefined,
                  desktopImage: {
                    url: b?.content?.media?.[0]?.filename || "",
                    alt: b?.content?.media?.[0]?.alt || "Desktop Banner Image",
                  },
                  mobileImage: {
                    url: b?.content?.media?.[1]?.filename || b?.content?.media?.[0]?.filename || "",
                    alt: b?.content?.media?.[1]?.alt || b?.content?.media?.[0]?.alt || "Mobile Banner Image",
                  },
                  title: b?.content?.teaser_title1 || "",
                  description: b?.content?.teaser_longText1 ? { doc: b.content.teaser_longText1 } : undefined,
                  cta: b?.content?.teaser_targets && {
                    label: b?.content?.teaser_targets?.[0]?.target_text || "",
                    url: (await getCtaUrl(b?.content?.teaser_targets?.[0]?.target)) || "",
                  },
                  backgroundColor: Array.isArray(b.content.backgroundColor)
                    ? b.content.backgroundColor[0]
                    : b.content.backgroundColor || "#FFFFFF",
                  reversed: localSettings.reversed || false,
                };
              }) ?? []
            )) ?? [],
        };

        return campaignSet;
      }) ?? []
    ),
    viewMoreProducts: viewMoreProducts?.contents[0]?.content?.title || "",
    banner: {
      title: banner?.contents[0]?.content?.teaser_title1 || "",
      description: banner?.contents[0]?.content?.teaser_longText1 || {},
    },
  };

  return PLPData;
};

export default PLPAdapter;
