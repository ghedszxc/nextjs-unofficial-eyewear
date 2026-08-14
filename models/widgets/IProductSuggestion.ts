import { ProductCardProduct } from "@/components/pdp/ProductCard";
import { TransformedProducts } from "@/types/plp";

export interface IProductSuggestion {
  title?: string;
  products: TransformedProducts;
}
