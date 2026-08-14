import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IAboutInfo } from "@/models/widgets/IAboutInfo";
import { api } from "@/lib/api";

export class AboutInfoAdapter extends Adapter<IAboutInfo, Promise<Nullable<IAboutInfo>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<IAboutInfo>> => {
    const data = source?.contents?.[0] ?? {};
    const content = data?.content ?? {};

    const collectionItems = content?.items ?? [];
    let collectionData = null;

    if (collectionItems.length > 0) {
      collectionData = await api.cms.stories({ by_uuids_ordered: collectionItems.join(","), language: lang });

      const twoColumnData = collectionData?.data?.[0]?.content ?? null;
      const centeredData = collectionData?.data?.[1]?.content ?? null;

      const richTextToPlain = (doc: any) => {
        if (!doc || !Array.isArray(doc.content)) return "";
        // join each paragraph block with a double newline
        return doc.content
          .map((block: any) => {
            if (!block || !Array.isArray(block.content)) return "";
            return block.content
              .map((node: any) => node?.text ?? "")
              .filter(Boolean)
              .join("");
          })
          .filter(Boolean)
          .join("\n\n")
          .trim();
      };

      const buildTwoColumn = (d: any) => {
        if (!d) {
          return {
            titleHeader: "",
            titleSubHeader: "",
            description: "",
            image: "",
          };
        }

        return {
          titleHeader: d?.teaser_title1 ?? "",
          titleSubHeader: d?.teaser_title1 ?? "",
          description: richTextToPlain(d?.teaser_longText1),
          image: d?.media?.[0]?.filename ?? "",
        };
      };

      const buildCentered = (d: any) => {
        if (!d) {
          return {
            titleHeader: "",
            titleSubHeader: "",
            image: "",
          };
        }

        return {
          titleHeader: d?.teaser_title ?? "",
          titleSubHeader: d?.teaser_text?.content?.[0]?.content?.[0]?.text ?? "",
          image: d?.media?.[0]?.filename ?? "",
        };
      };

      return {
        twoColumnInfo: buildTwoColumn(twoColumnData),
        centeredInfo: buildCentered(centeredData),
      };
    }
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
