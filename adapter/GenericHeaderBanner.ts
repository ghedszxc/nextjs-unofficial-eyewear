import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IGenericHeaderBanner } from "@/models/widgets/IGenericHeaderBanner";
import { api } from "@/lib/api";
import { getStoryblokRoot } from "@/constants/storyblok";
import { safeJsonParse } from "@/lib/utils";

export class GenericHeaderBannerAdapter extends Adapter<IGenericHeaderBanner, Promise<Nullable<IGenericHeaderBanner>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<IGenericHeaderBanner>> => {
    const data = source?.contents?.[0];
    const local_settings = safeJsonParse(data?.content?.local_settings?.code);

    const title = data?.content?.teaser_title1 || "";
    const body = {
      doc: data?.content?.teaser_longText1 || {},
    };

    const cta = {
      href:
        data?.content?.teaser_targets?.[0]?.target_anchor ||
        data?.content?.teaser_targets?.[0]?.target?.[0]?.full_slug?.replace(getStoryblokRoot(), "") ||
        "",
      text: data?.content?.teaser_targets?.[0]?.target_text || "",
    };

    const theme = local_settings?.theme || "dark";
    const bottomPadding = local_settings?.bottomPadding;
    const topPadding = local_settings?.topPadding;
    const ctaWidth = local_settings?.ctaWidth;

    return {
      title,
      body,
      cta,
      theme,
      topPadding,
      bottomPadding,
      ctaWidth,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
