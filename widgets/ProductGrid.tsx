import React, { Fragment } from "react";
import { IProductGrid } from "@/models/widgets/IProductGrid";
import Product from "@/components/Product";

const ProductGrid = ({ products }: IProductGrid) => {
  if (products?.length <= 0) return null;

  return (
    <div className="w-full bg-[#f7f1e8] py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-4 gap-12">
        {products.map((p) => (
          <Fragment key={p?.reference}>
            <Product
              image={p?.image}
              reference={p?.reference}
              gender={p?.gender}
              material={p?.material}
              href={p?.href}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
