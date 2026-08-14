import ProductSuggestion from "@/components/collections/ProductSuggestion";
import { IProductSuggestion } from "@/models/widgets/IProductSuggestion";

const ProductSuggestionWidget = (props: IProductSuggestion) => {
  return <ProductSuggestion {...props} />;
};

export default ProductSuggestionWidget;
