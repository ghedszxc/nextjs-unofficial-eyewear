import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { ICampaignBanner } from "@/models/widgets/ICampaignBanner";
import { api } from "@/lib/api";
import { getStoryblokRoot } from "@/constants/storyblok";
import { safeJsonParse } from "@/lib/utils";

export class CampaignBannerAdapter extends Adapter<ICampaignBanner, Promise<Nullable<ICampaignBanner>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<ICampaignBanner>> => {
    const data = source?.contents?.[0];
    const local_settings = safeJsonParse(data?.content?.local_settings?.code);
    const by_uuids = data?.content?.teaser_targets?.[0]?.target?.join(",");
    const { data: target } = await api.cms.stories({
      by_uuids_ordered: by_uuids,
      language: lang,
    });

    const title = data?.content?.teaser_title1 || "";
    const body = {
      doc: data?.content?.teaser_longText1 || {},
    };
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
    const cta = {
      href:
        data?.content?.teaser_targets?.[0]?.target_anchor ||
        data?.content?.teaser_targets?.[0]?.target?.[0]?.full_slug?.replace(getStoryblokRoot(), "") ||
        "",
      text: data?.content?.teaser_targets?.[0]?.target_text || "",
    };

    const theme = local_settings?.theme || "light";
    const bodyMaxWidth = local_settings?.bodyMaxWidth;

    return {
      image,
      body,
      title,
      cta,
      theme,
      bodyMaxWidth,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
