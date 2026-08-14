import { getStoryblokRoot } from "@/constants/storyblok";
import { api } from "@/lib/api";
import { ITwoColumnTextAndMedia } from "@/models/widgets/ITwoColumnTextAndMedia";
import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { safeJsonParse } from "@/lib/utils";

export class TwoColumnTextAndMediaAdapter extends Adapter<
  ITwoColumnTextAndMedia,
  Promise<Nullable<ITwoColumnTextAndMedia>>
> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<ITwoColumnTextAndMedia>> => {
    const data = source?.contents?.[0];

    const image = {
      desktop: {
        url: data?.content?.media?.[0]?.filename || "",
        alt: data?.content?.media?.[0]?.alt || "",
      },
      mobile: {
        url: data?.content?.media?.[1]?.filename || "",
        alt: data?.content?.media?.[1]?.alt || "",
      },
    };

    const title = data?.content?.teaser_title || "";
    // const subtitle = data?.content?.teaser_title2 || "";

    const subtitle = {
      doc: data?.content?.teaser_text || {},
    };

    const teaserTargets = data?.content?.teaser_targets || [];
    const targetUuids = teaserTargets
      .map((t: any) => t?.target)
      .flat()
      .filter(Boolean)
      .join(",");

    let resolvedSlugs: Record<string, string> = {};
    if (targetUuids) {
      const { data: targets } = await api.cms.stories({
        by_uuids_ordered: targetUuids,
        language: lang,
      });
      targets?.forEach((t: any) => {
        resolvedSlugs[t?.uuid] = t?.full_slug?.replace(getStoryblokRoot(), "") || "";
      });
    }

    const ctas = teaserTargets.map((t: any) => ({
      text: t?.target_text || "",
      href: t?.target_anchor, // resolvedSlugs[t?.target?.[0]] || "",
    }));

    let local_settings: any = {};
    try {
      local_settings = safeJsonParse(data?.content?.local_settings?.code);
    } catch {}

    const imagePosition = local_settings?.imagePosition ?? "left";
    const bgColor = local_settings?.bgColor ?? "#000000";
    const outerBgColor = local_settings?.outerBgColor ?? "#000000";
    const pt = local_settings?.pt ?? "";
    const ctaWidth = local_settings?.ctaWidth ?? undefined;
    const ctaLayout = local_settings?.ctaLayout ?? undefined;
    const maxWidth = local_settings?.maxWidth ?? "";
    const productCtas = local_settings?.productCtas ?? [];
    const titleMobile = local_settings?.teaserTitleMobile || "";
    const containerHeight = local_settings?.containerHeight;
    const responsiveImage = local_settings?.responsiveImage ?? false;

    return {
      image,
      title,
      titleMobile,
      subtitle,
      ctas,
      imagePosition,
      bgColor,
      outerBgColor,
      pt,
      ctaWidth,
      ctaLayout,
      maxWidth,
      productCtas,
      containerHeight,
      responsiveImage,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
