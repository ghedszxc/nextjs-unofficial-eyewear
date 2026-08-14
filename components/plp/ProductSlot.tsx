import { getVariantGroup } from "@/lib/utils";
import { FetchStatus, TransformedProducts } from "@/types/plp";
import { ProductCard } from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import ProductPlaceholderCard from "./ProductPlaceholderCard";

type ProductSlotProps = {
  index: number;
  transformedProducts: TransformedProducts;
  status: FetchStatus;
  lastInRow?: boolean;
};

const ProductSlot = ({ index, transformedProducts, status, lastInRow }: ProductSlotProps) => {
  if (status === "loading" || status === "idle") return <ProductCardSkeleton />;

  const group = getVariantGroup(transformedProducts, index);
  if (!group) return null;

  return <ProductCard products={group} lastInRow={lastInRow} />;
};

export default ProductSlot;
