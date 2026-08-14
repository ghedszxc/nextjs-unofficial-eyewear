import { IProductSuggestion } from "@/models/widgets/IProductSuggestion";
import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { getBaseUrl, getBaseUrlForServer, safeJsonParse, transformStoryblokProducts } from "@/lib/utils";
import { fetchHandler } from "@/lib/handlers/fetch";

export class ProductSuggestionAdapter extends Adapter<IProductSuggestion, Promise<Nullable<IProductSuggestion>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<IProductSuggestion>> => {
    const data = source?.contents?.[0];

    let local_settings: any = {};
    try {
      local_settings = safeJsonParse(data?.content?.local_settings?.code);
    } catch {}

    const collection = local_settings?.CAMPAIGN_FOOTER_SELECTION;
    if (!collection) return null;

    const title = data?.content?.teaser_title1 || "";
    // Using getBaseUrlForServer for server-side fetch (requires absolute URL).
    // fetchHandler checks response.ok before parsing — a CDN/origin HTML error
    // page must degrade to a hidden section, not crash the page render.
    const res = await fetchHandler<any>(`${getBaseUrlForServer()}/api/fetchProducts?lang=${lang}&category=products`);

    if (!res?.success) return null;
    const products = res?.data;

    const filteredProducts = products
      ?.map((story: any) => {
        const related = story?.content?.related_products ?? [];

        const filteredRelated = related.filter((rp: any) => {
          const variantCollection = String(rp?.content?.campaign_footer_selection ?? "").toLowerCase();
          return variantCollection === collection.toLowerCase();
        });

        return {
          ...story,
          content: {
            ...story.content,
            related_products: filteredRelated,
          },
        };
      })
      ?.filter((product: any) => product.content?.related_products?.length);

    const transformedProducts = transformStoryblokProducts(filteredProducts);
    const limited = transformedProducts.slice(0, 4);

    if (limited.length === 0) return null;

    return {
      title,
      products: limited,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
