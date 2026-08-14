import { ITwoColumnImage } from "@/models/widgets/ITwoColumnImage";
import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { api } from "@/lib/api";
import { getStoryblokRoot } from "@/constants/storyblok";
import { safeJsonParse } from "@/lib/utils";

function extractBanner(item: any): ITwoColumnImage["left"] {
  let local_settings: any = {};
  try {
    local_settings = safeJsonParse(item?.content?.local_settings?.code);
  } catch {}

  const ctaColor = local_settings?.ctaColor || "#000000";
  const lightBg = local_settings?.lightBg || undefined;

  return {
    desktop: {
      url: item?.content?.media?.[0]?.filename || "",
      alt: item?.content?.media?.[0]?.alt || "",
    },
    mobile: {
      url: item?.content?.media?.[1]?.filename || "",
      alt: item?.content?.media?.[1]?.alt || "",
    },
    label: item?.content?.teaser_title || "",
    lightBg,
    cta: {
      text: item?.content?.teaser_targets?.[0]?.target_text || "",
      href:
        item?.content?.teaser_targets?.[0]?.target_anchor ||
        item?.content?.teaser_targets?.[0]?.target?.[0]?.full_slug?.replace(getStoryblokRoot(), "") ||
        "",
      ctaColor,
      icon: item?.content?.teaser_icon?.[0]?.filename || "",
      thumbnail: item?.content?.teaser_icon?.[1]?.filename || "",
    },
  };
}

export class TwoColumnImageAdapter extends Adapter<ITwoColumnImage, Promise<Nullable<ITwoColumnImage>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<ITwoColumnImage>> => {
    const data = source?.contents?.[0];
    const by_uuids = data?.content?.items?.join(",");
    const { data: items } = await api.cms.stories({
      by_uuids_ordered: by_uuids,
      language: lang,
    });
    const left = extractBanner(items?.[0]);
    const right = extractBanner(items?.[1]);
    if (!left.desktop.url && !left.mobile.url && !right.desktop.url && !right.mobile.url) {
      return null;
    }

    let local_settings: any = {};
    try {
      local_settings = safeJsonParse(data?.content?.local_settings?.code);
    } catch {}

    const showText = local_settings?.showText ?? false;

    let title: string | undefined;
    let body: { doc: any } | undefined;

    if (showText) {
      const rawTitle = items?.[0]?.content?.teaser_title ?? "";
      const rawBody = items?.[0]?.content?.teaser_text;

      const hasText = rawBody?.content?.some((block: any) => block?.content?.some((node: any) => node?.text?.trim()));

      title = rawTitle || undefined;
      body = hasText ? { doc: rawBody } : undefined;
    }

    const bgColor = data?.content?.backgroundColor || "#FFFFFF";
    const responsiveImage = local_settings?.responsiveImage ?? false;
    const containerHeight = local_settings?.containerHeight;
    return { left, right, title, body, bgColor, responsiveImage, containerHeight };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
