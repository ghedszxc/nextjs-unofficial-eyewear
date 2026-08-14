import { IProductCard } from "@/models/widgets/IProductCard";
import { Nullable } from "@/adapter/model/Nullable.interface";
import { Adapter } from "@/adapter/model/Adapter";
import { safeJsonParse } from "@/lib/utils";

export class ProductCardAdapter extends Adapter<IProductCard, Nullable<IProductCard>> {
  adapt: (source: any) => Nullable<IProductCard> = (source) => {
    const data = source;
    const settings = safeJsonParse(data?.content?.local_settings?.code);
    const images = data?.content?.media?.map((image: any) => {
      return {
        url: image?.filename,
        alt: image?.alt,
      };
    });
    const tags = [
      {
        tag: settings?.attributes?.gender,
      },
      {
        tag: settings?.attributes?.material,
      },
      {
        tag: data?.content?.product_code,
      },
    ];

    const { type, content } = data?.content?.product_long_description || {};

    return {
      images,
      tags,
      description: {
        doc: {
          type,
          content,
        },
      },
    };
  };

  adaptReverse: (source: Nullable<any>) => any = (source) => {
    return source;
  };
}
