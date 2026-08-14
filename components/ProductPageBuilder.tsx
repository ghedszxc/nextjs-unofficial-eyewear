import { ProductCardAdapter } from "@/adapter/ProductCard";
import { IProductCard } from "@/models/widgets/IProductCard";
import { IProductGrid } from "@/models/widgets/IProductGrid";
import { ProductGridAdapter } from "@/adapter/ProductGrid";
import ProductCard from "@/widgets/ProductCard";
import ProductGrid from "@/widgets/ProductGrid";
import { ProductBannerAdapter } from "@/adapter/ProductBanner";
import { IProductBanner } from "@/models/components/IProductBanner";
import ProductBanner from "@/components/ProductBanner";

type Widget = {
  _uid: string;
  contents: Array<Record<string, any>>;
  component: string;
  layout_variant: Array<Record<string, any>>;
  placement_extra_properties: Array<Record<string, any>>;
  _editable?: string;
};

const ProductPageBuilder: React.FC<{
  lang: Language;
  widgets?: Widget[];
  data: any;
}> = async ({ widgets, data, lang }) => {
  const { images, tags, description } = new ProductCardAdapter().adapt(data) as IProductCard;
  const { products: related_products } = (await new ProductGridAdapter().adapt(
    data?.content?.related_products,
    lang
  )) as IProductGrid;
  const { banner, cta } = (await new ProductBannerAdapter()?.adapt(
    data?.content?.parent_category,
    lang
  )) as unknown as IProductBanner;

  return (
    <main>
      <ProductCard images={images} tags={tags} description={description} />
      <ProductBanner banner={banner} cta={cta} />
      <ProductGrid products={related_products} />
    </main>
  );
};

export default ProductPageBuilder;
