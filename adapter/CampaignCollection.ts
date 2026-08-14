import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { ICampaignCollection } from "@/models/widgets/ICampaignCollection";
import { api } from "@/lib/api";
import { getStoryblokRoot } from "@/constants/storyblok";

export class CampaignCollectionAdapter extends Adapter<ICampaignCollection, Promise<Nullable<ICampaignCollection>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<ICampaignCollection>> => {
    const data = source?.contents?.[0];
    const by_uuids = data?.content?.items?.join(",");

    const { data: items } = await api.cms.stories({
      by_uuids_ordered: by_uuids,
      language: lang,
      relations: ["teaser_targets.target"], // resolve teaser targets from banner
    });

    const campaigns = items?.map((item) => {
      return {
        image: {
          url: item?.content?.media?.[0]?.filename || "",
          alt: item?.content?.media?.[0]?.alt || "",
        },
        icon: {
          url: item?.content?.teaser_icon?.[0]?.filename || "",
          alt: item?.content?.teaser_icon?.[0]?.alt || "",
        },
        name: item?.content?.teaser_title1 || "",
        cta: {
          href:
            item?.content?.teaser_targets?.[0]?.target_anchor ||
            item?.content?.teaser_targets?.[0]?.target?.[0]?.full_slug?.replace(getStoryblokRoot(), "") ||
            "",
          text: item?.content?.teaser_targets?.[0]?.target_text || "",
        },
      };
    });

    return {
      campaigns,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
