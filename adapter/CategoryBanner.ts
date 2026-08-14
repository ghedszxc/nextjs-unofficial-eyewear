import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { ICategoryBanner } from "@/models/widgets/ICategoryBanner";

export class CategoryBannerAdapter extends Adapter<ICategoryBanner, Nullable<ICategoryBanner>> {
  adapt = (source: any): Nullable<ICategoryBanner> => {
    const data = source?.contents?.[0];
    const title = data?.content?.teaser_title1 || "";
    const { type, content } = data?.content?.teaser_longText1;
    const image = data?.content?.media?.[0]?.filename || "";

    return {
      title,
      description: {
        doc: {
          type,
          content,
        },
      },
      image,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
