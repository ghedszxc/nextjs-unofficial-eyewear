import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IHomeCenteredText } from "@/models/widgets/IHomeCenteredText";
import { api } from "@/lib/api";
import { getStoryblokRoot } from "@/constants/storyblok";

export class HomeCenteredTextAdapter extends Adapter<IHomeCenteredText, Promise<Nullable<IHomeCenteredText>>> {
  adapt = async (source: any): Promise<Nullable<IHomeCenteredText>> => {
    const data = source?.contents?.[0];
    const content = data?.content ?? {};

    //Title & Description
    const title = content.media?.[0]?.filename ?? "";
    const description = content.teaser_text?.content?.[0]?.content?.[0]?.text ?? "";

    //CTA Button
    const targetText = content.teaser_targets?.[0]?.target_text ?? "";
    // fetch a known page (fallback to empty string on failure)
    const { data: targetPage } = await api.cms.stories({
      by_uuids_ordered: content.teaser_targets?.[0]?.target?.[0],
    });

    const targetUrl = targetPage?.[0]?.full_slug?.replace(getStoryblokRoot(), "") ?? "";

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
