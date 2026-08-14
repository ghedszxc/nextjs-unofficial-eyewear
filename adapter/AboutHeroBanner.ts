import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IAboutHeroBanner } from "@/models/widgets/IAboutHeroBanner";

export class AboutHeroBannerAdapter extends Adapter<IAboutHeroBanner, Nullable<IAboutHeroBanner>> {
  adapt = (source: any): Nullable<IAboutHeroBanner> => {
    const data = source?.contents?.[0] ?? {};
    const image = data?.content?.media?.[0]?.filename ?? "";
    const alt = data?.name ?? "";
    const isVideo = /\.(mp4|webm|ogg)$/i.test(image);

    return {
      image,
      alt,
      mediaType: isVideo ? "video" : "image",
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
