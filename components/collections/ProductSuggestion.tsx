import { ProductCard } from "@/components/pdp/ProductCard";
import { IProductSuggestion } from "@/models/widgets/IProductSuggestion";

const ProductSuggestion = ({ title, products }: IProductSuggestion) => {
  if (!products?.length) return null;

  return (
    <div className="lg:px-20 lg:pb-20 lg:border-t lg:border-black">
      <div className="px-8 py-10">
        <p className="font-gt-america-expanded-bold text-center text-lg uppercase lg:text-xl">{title}</p>
      </div>
      <div className="scrollbar-hide flex overflow-x-auto p-6 pt-0 lg:overflow-visible lg:justify-center lg:p-0">
        {products.map((group, index) => (
          <div className="w-1/2 flex-none md:w-1/3 lg:w-1/4" key={index}>
            <ProductCard products={group} isLastIndex={index === products.length - 1} category="products" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSuggestion;
