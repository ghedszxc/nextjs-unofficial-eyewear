import { getStoryblokRoot } from "@/constants/storyblok";
import { api } from "@/lib/api";
import { ITabCareTips } from "@/models/widgets/ITabCareTips";
import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";

export class TabCareTipsAdapter extends Adapter<ITabCareTips, Promise<Nullable<ITabCareTips>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<ITabCareTips>> => {
    const data = source?.contents?.[0];
    const content = data?.content ?? {};

    const by_uuids = content?.items?.join(",");
    let tabs: ITabCareTips["tabs"] = [];

    if (by_uuids) {
      const { data: items } = await api.cms.stories({
        by_uuids_ordered: by_uuids,
        language: lang,
        relations: ["teaser_targets.target"],
      });

      tabs =
        items?.map((item: any) => ({
          tabName: item?.content?.teaser_title || "",
          tabContent: { doc: item?.content?.teaser_text || {} },
          image: item?.content?.media?.[0]
            ? {
                url: item.content.media[0].filename || "",
                alt: item.content.media[0].alt || "",
              }
            : undefined,
          icon: item?.content?.teaser_icon?.[0]
            ? {
                url: item.content.teaser_icon[0].filename || "",
                alt: item.content.teaser_icon[0].alt || "",
              }
            : undefined,
          cta: item?.content?.teaser_targets?.[0]
            ? {
                href:
                  item.content.teaser_targets[0].target?.[0]?.full_slug?.replace(
                    getStoryblokRoot(),
                    ""
                  ) || "",
                text: item.content.teaser_targets[0].target_text || "",
              }
            : undefined,
        })) || [];
    }

    return { tabs };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
