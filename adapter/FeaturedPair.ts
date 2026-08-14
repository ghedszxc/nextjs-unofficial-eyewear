import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IFeaturedPair } from "@/models/widgets/IFeaturedPair";
import { api } from "@/lib/api";
import { getStoryblokRoot } from "@/constants/storyblok";
import { safeJsonParse } from "@/lib/utils";

export class FeaturedPairAdapter extends Adapter<IFeaturedPair, Promise<Nullable<IFeaturedPair>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<IFeaturedPair>> => {
    const data = source?.contents?.[0];
    const local_settings = safeJsonParse(data?.content?.local_settings?.code);
    const by_uuids = data?.content?.items?.join(",");

    const { data: items } = await api.cms.stories({
      by_uuids_ordered: by_uuids,
      language: lang,
      relations: ["teaser_targets.target"], // resolve teaser targets from banner
    });

    const cards =
      items?.map((item, i: number) => {
        if (item?.content?.teaser_title1 == "EYEGLASSES") {
          console.log(item?.content?.teaser_title1, item?.content?.teaser_targets?.[0]?.target_anchor);
        }

        return {
          subtitle: item?.content?.teaser_title1 || "",
          image: {
            desktop: {
              url: item?.content?.media?.[0]?.filename || "",
              alt: item?.content?.media?.[0]?.alt || "",
            },
            mobile: {
              url: item?.content?.media?.[1]?.filename || "",
              alt: item?.content?.media?.[1]?.alt || "",
            },
          },
          icon: {
            url: item?.content?.teaser_icon?.[0]?.filename || "",
            alt: item?.content?.teaser_icon?.[0]?.alt || "",
          },
          link: {
            url:
              item?.content?.teaser_targets?.[0]?.target_anchor ||
              item?.content?.teaser_targets?.[0]?.target?.[0]?.full_slug?.replace(getStoryblokRoot(), "") ||
              "",
            text: item?.content?.teaser_targets?.[0]?.target_text || "",
          },
          position: (i === 0 ? "left" : "right") as "left" | "right",
        };
      }) ?? [];

    const swap = local_settings?.swap;
    const variant = local_settings?.variant || "default";
    const imageSize = local_settings?.image_size;
    const bgColor = data?.content?.backgroundColor || "#FFFFFF";
    const pt = local_settings?.pt;
    const pb = local_settings?.pb;

    console.log(bgColor);

    return {
      cards,
      swap,
      variant,
      imageSize,
      bgColor,
      pt,
      pb,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
