import { ICareTipsBanner } from "@/models/widgets/ICareTipsBanner";
import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";

export class BannerCareTipsAdapter extends Adapter<ICareTipsBanner, Promise<Nullable<ICareTipsBanner>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<ICareTipsBanner>> => {
    const data = source?.contents?.[0];
    const content = data?.content ?? {};
    const heading = content?.teaser_title || content?.teaser_title1 || "";
    const subtitle = content?.teaser_title2 || "";
    return { heading, subtitle };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
