import { getStoryblokRoot } from "@/constants/storyblok";
import { api } from "@/lib/api";
import { ICenteredBanner } from "@/models/widgets/ICenteredBanner";
import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { safeJsonParse } from "@/lib/utils";

export class CenteredBannerAdapter extends Adapter<ICenteredBanner, Promise<Nullable<ICenteredBanner>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<ICenteredBanner>> => {
    const data = source?.contents?.[0];

    const by_uuids = data?.content?.teaser_targets?.[0]?.target?.join(",");
    const { data: target } = await api.cms.stories({
      by_uuids_ordered: by_uuids,
      language: lang,
    });

    const title = data?.content?.teaser_title1 || "";
    const name = data?.content?.teaser_title2 || "";
    const body = {
      doc: data?.content?.teaser_longText1 || {},
    };
    const videoRegex = /\.(mp4|webm|ogg)$/i;
    const desktopUrl = data?.content?.media?.[0]?.filename || "";
    const mobileUrl = data?.content?.media?.[1]?.filename || "";
    const image = {
      desktop: {
        url: desktopUrl,
        alt: data?.content?.media?.[0]?.alt || "",
        mediaType: videoRegex.test(desktopUrl) ? "video" as const : "image" as const,
      },
      mobile: {
        url: mobileUrl,
        alt: data?.content?.media?.[1]?.alt || "",
        mediaType: videoRegex.test(mobileUrl) ? "video" as const : "image" as const,
      },
    };
    const cta = {
      href: target?.[0]?.full_slug?.replace(getStoryblokRoot(), "") || "",
      text: data?.content?.teaser_targets?.[0]?.target_text || "",
    };

    let local_settings: any = {};
    try {
      local_settings = safeJsonParse(data?.content?.local_settings?.code);
    } catch {}

    const noTeaserText = local_settings?.noTeaserText ?? false;
    const imageHeight = local_settings?.imageHeight;
    const mobileImageHeight = local_settings?.mobileImageHeight;
    const responsiveImage = local_settings?.responsiveImage ?? false;
    const containerHeight = local_settings?.containerHeight;

    return {
      image,
      body,
      title,
      name,
      cta,
      noTeaserText,
      imageHeight,
      mobileImageHeight,
      responsiveImage,
      containerHeight,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
