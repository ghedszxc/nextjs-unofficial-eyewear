import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IFAQ } from "@/models/widgets/IFAQ";
import { api } from "@/lib/api";
import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export class FAQAdapter extends Adapter<IFAQ, Promise<Nullable<IFAQ>>> {
  adapt = async (source: any): Promise<Nullable<IFAQ>> => {
    const data = source?.contents?.[0];
    const title = data?.content?.collection_title || "";
    const items_uuids = data?.content?.items;
    const { data: items } = await api.cms.stories({ by_uuids_ordered: items_uuids.join(",") });

    return {
      collectionTitle: title,
      collection: items?.map((item: any) => ({
        title: item.content.teaser_title,
        description: {
          doc: {
            type: item.content.teaser_text.type,
            content: item.content.teaser_text.content,
          },
        },
      })) as {
        title: string;
        description: Pick<StoryblokRichTextProps, "doc">;
      }[],
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
