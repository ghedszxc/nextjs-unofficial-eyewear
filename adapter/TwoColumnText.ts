import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { ITwoColumnText } from "@/models/widgets/ITwoColumnText";
import { api } from "@/lib/api";

export class TwoColumnTextAdapter extends Adapter<ITwoColumnText, Promise<Nullable<ITwoColumnText>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<ITwoColumnText>> => {
    const data = source?.contents?.[0];
    const by_uuids = data?.content?.items?.join(",");

    const { data: items } = await api.cms.stories({
      by_uuids_ordered: by_uuids,
      language: lang,
      relations: ["teaser_targets.target"],
    });

    const columns = items?.map((item: any) => ({
      title: item?.content?.teaser_title || "",
      subtitle: {
        doc: item?.content?.teaser_text || {},
      },
      cta: {
        href: item?.content?.teaser_targets?.[0]?.target_anchor || "",
        text: item?.content?.teaser_targets?.[0]?.target_text || "",
      },
    })) ?? [];

    return {
      columns,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
