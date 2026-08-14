import React from "react";
import Image from "next/image";
import { IProduct } from "@/models/widgets/IProduct";
import Link from "next/link";

const Product = ({ image, reference, gender, material, href }: IProduct) => {
  return (
    <>
      <Link className="group cursor-pointer" href={href}>
        <div className="flex h-40 w-full items-center justify-center overflow-hidden">
          <Image
            src={image}
            alt={reference}
            className="max-h-full transition duration-300 group-hover:scale-105"
            width={265}
            height={150}
            
          />
        </div>

        <div className="mt-4 ml-4 leading-tight">
          <p className="text-sm font-semibold">
            Ref. {reference} <span className="inline-block">↗</span>
          </p>
          <p className="text-sm text-gray-700">{gender}</p>
          <p className="text-sm text-gray-600">{material}</p>
        </div>
      </Link>
    </>
  );
};
export default Product;
