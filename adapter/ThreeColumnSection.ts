import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IThreeColumnSection } from "@/models/widgets/IThreeColumnSection";
import { api } from "@/lib/api";

const getStoriesByUuids = async (uuids: string[], lang: Language): Promise<any[] | null> => {
  if (!uuids.length) return [];
  const { success, data } = await api.cms.stories({
    by_uuids_ordered: uuids.join(","),
    language: lang,
  });

  return success && Array.isArray(data) ? data : null;
};

export class ThreeColumnSectionAdapter extends Adapter<IThreeColumnSection, Promise<Nullable<IThreeColumnSection>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<IThreeColumnSection>> => {
    const uuids: string[] = (source?.contents?.[0]?.content?.items ?? []).filter(
      (id: unknown): id is string => typeof id === "string" && id.length > 0
    );

    const stories = await getStoriesByUuids(uuids, lang!);
    const columns = (stories ?? []).slice(0, 3).map((story: any) => ({
      title: story?.content?.teaser_title || "",
      subtitle: story?.content?.teaser_text?.content?.[0]?.content?.[0]?.text || "",
    }));

    return { columns };
  };

  adaptReverse = (source: Nullable<any>) => source;
}
