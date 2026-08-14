import { api } from "@/lib/api";
import { IFaqAccordion } from "@/models/widgets/IFaqAccordion";
import { Nullable } from "@/adapter/model/Nullable.interface";
import { Adapter } from "@/adapter/model/Adapter";
import { StoryblokRichTextProps } from "@storyblok/react/rsc";
import { safeJsonParse } from "@/lib/utils";

export class FaqAccordionAdapter extends Adapter<IFaqAccordion, Promise<Nullable<IFaqAccordion>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<IFaqAccordion>> => {
    const data = source?.contents?.[0];
    const content = data?.content ?? {};

    const collectionTitle = content?.collection_title || "";
    const localSettings = (() => {
      try { return safeJsonParse(content?.local_settings?.code); }
      catch { return {}; }
    })();
    const pb = localSettings?.pb;
    const by_uuids = content?.items?.join(",");
    let items: IFaqAccordion["items"] = [];

    if (by_uuids) {
      const { data: stories } = await api.cms.stories({
        by_uuids_ordered: by_uuids,
        language: lang,
      });

      items =
        stories?.map((item: any) => ({
          question: item?.content?.teaser_title || "",
          answer: {
            doc: {
              type: item?.content?.teaser_text?.type,
              content: item?.content?.teaser_text?.content,
            },
          },
        })) as {
          question: string;
          answer: Pick<StoryblokRichTextProps, "doc">;
        }[] || [];
    }

    return { collectionTitle, items, ...(pb && { pb }) };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
