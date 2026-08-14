import { safeJsonParse } from "@/lib/utils";
import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { ISectionHeader } from "@/models/widgets/ISectionHeader";

export class SectionHeaderAdapter extends Adapter<ISectionHeader, Promise<Nullable<ISectionHeader>>> {
  adapt = async (source: any): Promise<Nullable<ISectionHeader>> => {
    const data = source?.contents?.[0];
    const content = data?.content ?? {};

    const title = content.teaser_title ?? "";
    const subtitle = content.teaser_text
      ? { doc: content.teaser_text }
      : undefined;

    let local_settings: any = {};
    try {
      local_settings = safeJsonParse(content?.local_settings?.code);
    } catch {}

    const withSubtitle = local_settings?.withSubtitle ?? false;
    const maxWidth = local_settings?.maxWidth ?? "";
    const titleFontSize = local_settings?.titleFontSize ?? undefined;
    const titleFontSizeMobile = local_settings?.titleFontSizeMobile ?? undefined;
    const titleFontFamily = local_settings?.titleFontFamily ?? undefined;
    const paddingTop = local_settings?.paddingTop ?? undefined;

    const cta = {
      href: content?.teaser_targets?.[0]?.target_anchor || "",
      text: content?.teaser_targets?.[0]?.target_text || "",
    };

    return {
      title,
      subtitle,
      withSubtitle,
      maxWidth,
      titleFontSize,
      titleFontSizeMobile,
      titleFontFamily,
      paddingTop,
      cta,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
