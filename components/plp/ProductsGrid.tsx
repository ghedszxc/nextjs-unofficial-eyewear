import { FetchStatus, TransformedProducts } from "@/types/plp";
import ProductSlot from "./ProductSlot";

type ProductsGridProps = {
  transformedProducts: TransformedProducts;
  status: FetchStatus;
  slotCount: number;
  className?: string;
};

const ProductsGrid = ({ transformedProducts, status, slotCount, className }: ProductsGridProps) => {
  const slots = Math.max(slotCount, transformedProducts.length);

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 ${className ?? ""}`}>
      {Array.from({ length: slots }).map((_, i) => (
        <div key={i} className="col-span-1 h-[327px] lg:h-[474px]">
          <ProductSlot index={i} transformedProducts={transformedProducts} status={status} />
        </div>
      ))}
    </div>
  );
};

export default ProductsGrid;
