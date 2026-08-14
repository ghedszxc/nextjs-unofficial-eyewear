import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IProductGrid } from "@/models/widgets/IProductGrid";
import { api } from "@/lib/api";
import { getStoryblokRoot } from "@/constants/storyblok";
import { safeJsonParse } from "@/lib/utils";

export class ProductGridAdapter extends Adapter<IProductGrid, Promise<Nullable<IProductGrid>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<IProductGrid>> => {
    const by_uuids = source?.join(",");

    const { success, data } = await api.cms.stories({
      by_uuids_ordered: by_uuids,
      language: lang,
    });
    
    if (!success) return { products: [] };

    const products = data?.map((product: any) => {
      const { attributes } = safeJsonParse(product?.content?.local_settings?.code);
      return {
        image: product?.content?.media?.[0]?.filename,
        reference: product?.content?.product_code,
        gender: attributes?.gender,
        material: attributes?.material,
        href: product?.full_slug?.replace(getStoryblokRoot(), ""),
      };
    });

    return {
      products: products!,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
