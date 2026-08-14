import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IHomeHeroBanner } from "@/models/widgets/IHomeHeroBanner";

export class HomeHeroBannerAdapter extends Adapter<IHomeHeroBanner, Nullable<IHomeHeroBanner>> {
  adapt = (source: any): Nullable<IHomeHeroBanner> => {
    const data = source?.contents?.[0] ?? {};
    const image = data?.content?.media?.[0]?.filename ?? "";
    const alt = data?.name ?? "";

    return {
      image,
      alt,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
