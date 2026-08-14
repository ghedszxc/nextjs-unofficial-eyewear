import { getBaseUrl, getBaseUrlForServer, transformStoryblokProducts } from "@/lib/utils";
import { useProductData } from "./useProductData";
import { ProductCard } from "./ProductCard";
import { fetchHandler } from "@/lib/handlers/fetch";

const YouMayAlsoLike = async ({ productId, pdpData, lang, isEditorial }: { productId: string; pdpData: any; lang: Language; isEditorial: boolean }) => {
  // Extract product data using the hook
  const { productCode, productAttributes } = useProductData(pdpData, productId);

  // Derive data from productCode and attributes
  const productModel = productCode?.split(" ")[0];
  const productCollection = productAttributes?.FRAME_SHAPE;

  const MAX_PRODUCTS = 4;

  /// Using getBaseUrlForServer for server-side fetch (requires absolute URL).
  // fetchHandler checks response.ok before parsing — a CDN/origin HTML error
  // page must degrade to a hidden section, not crash the page render.
  const res = await fetchHandler<any>(
    `${getBaseUrlForServer()}/api/fetchProducts?lang=${lang}&category=products&attributes.FRAME_SHAPE=${productCollection}`
  );

  if (!res?.success) return null;

  const products = res?.data;
  const transformedProducts = transformStoryblokProducts(products);

  // Remove the product/product variants itself on you may like
  const filtered = transformedProducts
    .map((group) => group.filter((item) => !item.name.startsWith(productModel)))
    .filter((group) => group.length > 0);

  // Early return: don't render anything if no products available
  if (!filtered || filtered.length === 0) {
    return null;
  }

  const visible = filtered.slice(0, MAX_PRODUCTS);
  const isSingleProduct = visible.length === 1;

  // Width class mapping for Tailwind - see constants for reference
  const widthClasses: Record<number, string> = {
    2: "w-[50%] shrink-0 md:w-1/2 lg:w-1/2",
    3: "w-[50%] shrink-0 md:w-1/3 lg:w-1/3",
    4: "w-[50%] shrink-0 md:w-1/4 lg:w-1/4",
  };
  const widthClass = widthClasses[visible.length] || widthClasses[4];

  return (
    <div className={`${isEditorial ? "border-t border-black" : ""} lg:px-20 lg:pb-20`}>
      <div className="px-8 py-10">
        <p className="font-gt-america-expanded-bold text-center text-lg uppercase lg:text-xl">You May Also Like</p>
      </div>
      <div className={`scrollbar-hide flex ${isSingleProduct ? "justify-center" : "overflow-x-auto"} p-6 pt-0 lg:p-0`}>
        {filtered.slice(0, MAX_PRODUCTS).map((group, index) => {
          const isLastIndex = index === Math.min(MAX_PRODUCTS, filtered.length) - 1;
          return (
            <div className={widthClass} key={index}>
              <ProductCard products={group} isLastIndex={isLastIndex} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YouMayAlsoLike;
