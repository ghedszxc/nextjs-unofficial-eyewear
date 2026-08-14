import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { ITwoColumnSection } from "@/models/widgets/ITwoColumnSection";
import { safeJsonParse } from "@/lib/utils";

export class TwoColumnSectionAdapter extends Adapter<ITwoColumnSection, Promise<Nullable<ITwoColumnSection>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<ITwoColumnSection>> => {
    const data = source?.contents?.[0];

    const title = data?.content?.teaser_title1 || "";
    const titleMobile = data?.content?.teaser_title2 || "";
    const longText = {
      doc: data?.content?.teaser_longText1 || {},
    };
    const bgColor = data?.content?.backgroundColor || "#000000";

    const localSettings = safeJsonParse(data?.content?.local_settings?.code);
    const fontColor = localSettings?.fontColor || "#000000";

    return {
      title,
      titleMobile,
      longText,
      bgColor,
      fontColor,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
