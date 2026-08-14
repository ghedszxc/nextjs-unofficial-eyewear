import React from "react";
import { IProductBanner } from "@/models/components/IProductBanner";
import Link from "next/link";
import RichText from "@/components/RichText";

const ProductBanner = ({ banner, cta }: IProductBanner) => {
  return (
    <section className="flex w-full flex-col items-center bg-[#f7f2e9] px-4 py-24 text-center">
      <RichText
        doc={{
          type: banner.doc.type,
          content: banner.doc.content,
        }}
      />

      <Link
        href={cta.href}
        className="mt-8 cursor-pointer rounded-md border border-[#3c3b1f] px-8 py-3 text-sm tracking-wide text-[#3c3b1f] transition hover:bg-[#3c3b1f] hover:text-white"
      >
        {cta.text}
      </Link>
    </section>
  );
};

export default ProductBanner;
