import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IHomeSocialBanner } from "@/models/widgets/IHomeSocialBanner";
import { api } from "@/lib/api";

export class HomeSocialBannerAdapter extends Adapter<IHomeSocialBanner, Promise<Nullable<IHomeSocialBanner>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<IHomeSocialBanner>> => {
    const data = source?.contents?.[0];
    const content = data?.content ?? {};

    //Banner Image
    const image = content.media?.[0]?.filename ?? "";

    //CTA Button
    const targetEntry = content.teaser_targets?.[0] ?? {};
    const targetText = targetEntry?.target_text ?? "";
    const targetId = targetEntry?.target?.[0];

    let targetUrl = "";
    if (targetId) {
      const targetData = await api.cms.stories({ by_uuids_ordered: targetId, language: lang });
      targetUrl = targetData?.data?.[0]?.content?.url ?? "";
    }

    return {
      image,
      actionButton: { text: targetText, targetUrl },
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
