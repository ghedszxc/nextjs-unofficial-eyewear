import { IProductBanner } from "@/models/components/IProductBanner";
import { Adapter } from "@/adapter/model/Adapter";
import { Nullable } from "@/adapter/model/Nullable.interface";
import { api } from "@/lib/api";
import { getStoryblokRoot } from "@/constants/storyblok";

export class ProductBannerAdapter extends Adapter<IProductBanner, Promise<Nullable<IProductBanner>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<IProductBanner>> => {
    const by_uuids = source.join(",");
    const { data } = await api.cms.stories({
      by_uuids_ordered: by_uuids,
      language: lang,
    });

    const { type, content } = data?.[0]?.content?.category_long_description || {};
    const cta = {
      text: data?.[0]?.content?.category_short_description,
      href: data?.[0]?.full_slug?.replace(getStoryblokRoot(), "") || "",
    };

    return {
      banner: {
        doc: {
          type,
          content,
        },
      },
      cta,
    };
  };

  adaptReverse: (source: Nullable<any>) => any = (source) => {
    return source;
  };
}
