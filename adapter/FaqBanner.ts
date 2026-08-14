import { IFaqBanner } from "@/models/widgets/IFaqBanner";
import { Nullable } from "@/adapter/model/Nullable.interface";
import { Adapter } from "@/adapter/model/Adapter";

export class FaqBannerAdapter extends Adapter<IFaqBanner, Promise<Nullable<IFaqBanner>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<IFaqBanner>> => {
    const data = source?.contents?.[0];
    const content = data?.content ?? {};

    const heading = content?.teaser_title || content?.teaser_title1 || "";

    return { heading };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
