import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import {
  IProductPillSlider,
  IProductPillSliderItem,
} from "@/models/widgets/IProductPillSlider";
import { api } from "@/lib/api";
import { getStoryblokRoot } from "@/constants/storyblok";
import { safeJsonParse } from "@/lib/utils";

export class ProductPillSliderAdapter extends Adapter<
  IProductPillSlider,
  Promise<Nullable<IProductPillSlider>>
> {
  adapt = async (
    source: any,
    lang?: Language
  ): Promise<Nullable<IProductPillSlider>> => {
    const data = source?.contents?.[0];
    const content = data?.content ?? {};

    const title = content.collection_title ?? "";

    const by_uuids = content.items?.join(",");
    const { data: items } = await api.cms.stories({
      by_uuids_ordered: by_uuids,
      language: lang,
    });

    const pills: IProductPillSliderItem[] = (items ?? []).map((item: any) => ({
      label: item?.content?.teaser_title ?? "",
      name:
        item?.content?.teaser_title2 ?? item?.content?.teaser_title ?? "",
      price: item?.content?.teaser_title1 ?? "",
      image: {
        url: item?.content?.media?.[0]?.filename || "",
        alt: item?.content?.media?.[0]?.alt || "",
      },
      thumbnail: {
        url:
          item?.content?.media?.[1]?.filename ||
          item?.content?.media?.[0]?.filename ||
          "",
        alt:
          item?.content?.media?.[1]?.alt ||
          item?.content?.media?.[0]?.alt ||
          "",
      },
      icon: {
        url: item?.content?.teaser_icon?.[0]?.filename || "",
        alt: item?.content?.teaser_icon?.[0]?.alt || "",
      },
      ctaIcon: {
        url: item?.content?.teaser_icon?.[1]?.filename || "",
        alt: item?.content?.teaser_icon?.[1]?.alt || "",
      },
      targetUrl:
        item?.content?.teaser_targets?.[0]?.target_anchor ||
        item?.full_slug?.replace(getStoryblokRoot(), "") ||
        "",
      ctaText: item?.content?.teaser_targets?.[0]?.target_text ?? "",
    }));

    let local_settings: any = {};
    try {
      local_settings = safeJsonParse(data?.content?.local_settings?.code);
    } catch {}

    const maxVisibleButtons = local_settings?.maxVisibleButtons ?? undefined;

    return { title, pills, maxVisibleButtons };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
