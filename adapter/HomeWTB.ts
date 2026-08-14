import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IHomeWTB } from "@/models/widgets/IHomeWTB";
import { api } from "@/lib/api";

export class HomeWTBAdapter extends Adapter<IHomeWTB, Promise<Nullable<IHomeWTB>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<IHomeWTB>> => {
    const data = source?.contents?.[0];
    const content = data?.content ?? {};

    //Title & Description
    const title = content?.teaser_title ?? null;
    const description = content?.teaser_text?.content?.[0]?.content?.[0]?.text ?? null;

    //CTA Button
    const target = content?.teaser_targets?.[0];
    const targetText = target?.target_text ?? "";
    const targetId = target?.target?.[0];

    let targetUrl = "";
    if (targetId) {
      const targetData = await api.cms.stories({
        by_uuids_ordered: targetId,
        language: lang,
      });
      targetUrl = targetData?.data?.[0]?.content?.url ?? "";
    }

    return {
      title,
      description,
      actionButton: { text: targetText, targetUrl },
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
