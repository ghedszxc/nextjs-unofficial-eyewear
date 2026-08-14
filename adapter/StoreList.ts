import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IStoreList } from "@/models/widgets/IStoreList";
import { api } from "@/lib/api";
import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export class StoreListAdapter extends Adapter<IStoreList, Promise<Nullable<IStoreList>>> {
  adapt = async (source: any): Promise<Nullable<IStoreList>> => {
    const data = source?.contents?.[0];
    const suggestedText = data?.content?.collection_title || "";
    const storesAvailableText = data?.content?.collection_subtitle || "";
    const visitStoreText = data?.content?.collection_subtitle.split("|")[2] || "";
    const visitTextAccordion = data?.content?.collection_subtitle.split("|")[3] || ""
    const searchText = data?.content?.collection_caption || "";
    const items_uuids = data?.content?.items;
    const { data: items } = await api.cms.stories({ by_uuids_ordered: items_uuids.join(",") });
 
    return {
      suggestedText: suggestedText,
      storesAvailableText: storesAvailableText,
      visitStoreText: visitStoreText,
      visitTextAccordion: visitTextAccordion,
      searchPlaceholderText: searchText.split("|")[0],
      searchArrowTextDsk: searchText.split("|")[1],
      searchArrowTextMob: searchText.split("|")[2],
      items: items?.map((item: any) => ({
        region: item?.content?.teaser_title1,
        country: item?.content?.teaser_title2,
        url: item?.content?.teaser_title3,
        store: item?.content?.teaser_title4,
        logo: {
          url: item?.content?.teaser_icon?.[0]?.filename || "",
          alt: item?.content?.teaser_icon?.[0]?.alt || "",
        },
        logoColor: item?.content?.backgroundColor
      })) as {
        region: string;
        country: string;
        url: string;
        store: string;
        logo: { url: string; alt: string };
        logoColor: string
      }[],
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
