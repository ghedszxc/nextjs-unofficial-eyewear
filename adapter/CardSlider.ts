import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { ICardSlider } from "@/models/widgets/ICardSlider";
import { api } from "@/lib/api";

const getStoriesByUuids = async (uuids: string[], lang: Language): Promise<any[] | null> => {
  if (!uuids.length) return [];
  const { success, data } = await api.cms.stories({
    by_uuids_ordered: uuids.join(","),
    language: lang,
  });
  return success && Array.isArray(data) ? data : null;
};

export class CardSliderAdapter extends Adapter<ICardSlider, Promise<Nullable<ICardSlider>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<ICardSlider>> => {
    const uuids: string[] = (source?.contents?.[0]?.content?.items ?? []).filter(
      (id: unknown): id is string => typeof id === "string" && id.length > 0
    );

    const stories = await getStoriesByUuids(uuids, lang!);
    const items = (stories ?? []).map((story: any) => ({
      title: story?.content?.title || "",
      subtitle: story?.content?.subtitle || "",
      image: story?.content?.media?.[0]?.filename || "",
      alt: story?.content?.media?.[0]?.alt || "",
      href: story?.content?.href || "",
    }));

    return { items };
  };

  adaptReverse = (source: Nullable<any>) => source;
}
