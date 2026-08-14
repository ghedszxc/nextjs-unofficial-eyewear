import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { ICenterImage } from "@/models/widgets/ICenterImage";
import { api } from "@/lib/api";
import { getStoryblokRoot } from "@/constants/storyblok";

export class CenterImageAdapter extends Adapter<ICenterImage, Promise<Nullable<ICenterImage>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<ICenterImage>> => {
    const data = source?.contents?.[0];
    const by_uuids = data?.content?.teaser_targets?.[0]?.target?.join(",");
    const { data: target } = await api.cms.stories({
      by_uuids_ordered: by_uuids,
      language: lang,
    });

    const image = {
      url: data?.content?.media?.[0]?.filename || "",
      alt: data?.content?.media?.[0]?.alt || "",
    };
    const text = data?.content?.teaser_title1 || "";
    const icon = {
      url: data?.content?.teaser_icon?.[0]?.filename || "",
      alt: data?.content?.teaser_icon?.[0]?.alt || "",
    };
    const link = {
      url: target?.[0]?.full_slug?.replace(getStoryblokRoot(), "") || "",
      text: data?.content?.teaser_targets?.[0]?.target_text || "",
    };

    return {
      image,
      text,
      icon,
      link,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
