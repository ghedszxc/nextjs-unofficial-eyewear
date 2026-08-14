import { safeJsonParse } from "@/lib/utils";
import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IHeroSection } from "@/models/widgets/IHeroSection";

export class HeroSectionAdapter extends Adapter<IHeroSection, Nullable<IHeroSection>> {
  adapt = (source: any): Nullable<IHeroSection> => {
    const data = source?.contents?.[0];
    const local_settings = safeJsonParse(data?.content?.local_settings?.code);

    const title1 = data?.content?.teaser_title1 || "";
    const title2 = data?.content?.teaser_title2 || "";
    const body = {
      doc: data?.content?.teaser_longText1 || {},
    };
    const visual = {
      desktop: {
        url: data?.content?.media?.[0]?.filename || "",
        alt: data?.content?.media?.[0]?.alt || "",
        type: "image" as "image" | "video",
      },
      mobile: {
        url: data?.content?.media?.[1]?.filename || "",
        alt: data?.content?.media?.[1]?.alt || "",
        type: "image" as "image" | "video",
      },
    };
    const icon = {
      url: data?.content?.teaser_icon?.[0]?.filename || "",
      alt: data?.content?.teaser_icon?.[0]?.alt || "",
    };
    const link = {
      type: "anchor" as "anchor" | "internal",
      href: data?.content?.teaser_targets?.[0]?.target_anchor || "",
      text: data?.content?.teaser_targets?.[0]?.target_text,
    };
    const isVideo = local_settings?.isVideo;

    return {
      title1,
      title2,
      body,
      visual,
      icon,
      link,
      isVideo,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
