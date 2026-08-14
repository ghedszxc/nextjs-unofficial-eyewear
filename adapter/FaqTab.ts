import { api } from "@/lib/api";
import { IFaqTab } from "@/models/widgets/IFaqTab";
import { Nullable } from "@/adapter/model/Nullable.interface";
import { Adapter } from "@/adapter/model/Adapter";

export class FaqTabAdapter extends Adapter<IFaqTab, Promise<Nullable<IFaqTab>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<IFaqTab>> => {
    const data = source?.contents?.[0];
    const content = data?.content ?? {};

    const by_uuids = content?.items?.join(",");
    let tabs: IFaqTab["tabs"] = [];

    if (by_uuids) {
      const { data: items } = await api.cms.stories({
        by_uuids_ordered: by_uuids,
        language: lang,
      });

      tabs =
        items?.map((item: any) => ({
          tabName: item?.content?.teaser_title || "",
          anchorTarget: item?.content?.teaser_targets?.[0]?.target_anchor || "",
        })) || [];
    }

    return { tabs };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
