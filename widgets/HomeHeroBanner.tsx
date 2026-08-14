import { IHomeHeroBanner } from "@/models/widgets/IHomeHeroBanner";
import React from "react";
import Image from "next/image";
import { imageSizes } from "@/lib/image-sizes";

const HomeHeroBanner = ({ image, alt }: IHomeHeroBanner) => {
  return (
    <div className="relative h-[945px] w-full">
      <Image src={image} alt={alt} fill sizes={imageSizes({ base: "100vw", lg: "100vw" })} className="object-cover" priority />
    </div>
  );
};

export default HomeHeroBanner;
