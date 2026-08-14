import { IAboutInfo } from "@/models/widgets/IAboutInfo";
import React from "react";
import Image from "next/image";
import { imageSizes } from "@/lib/image-sizes";

const AboutInfoBanner = ({ twoColumnInfo, centeredInfo }: IAboutInfo) => {
  return (
    <div className="flex flex-col items-center bg-black">
      <div className="max-w-10xl grid w-full grid-cols-1 gap-24 md:grid-cols-2">
        <div className="p-20">
          <h1 className="text-5xl font-bold tracking-wider text-white">{twoColumnInfo.titleHeader}</h1>
          <h1 className="mt-12 text-3xl font-bold tracking-wider text-white">{twoColumnInfo.titleSubHeader}</h1>
          <p className="mt-6 text-base tracking-wide whitespace-pre-line text-white">{twoColumnInfo.description}</p>
        </div>
        <div className="flex items-center justify-end">
          <div className="relative right-20 h-[460px] w-[320px] overflow-hidden md:h-[920px] md:w-[520px]">
            <Image src={twoColumnInfo.image} alt="AboutInfoImage" fill sizes={imageSizes({ base: "320px", md: "520px" })} className="object-cover" />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center p-8 text-center md:px-12 xl:my-15">
        {centeredInfo.titleHeader && <h1 className="mt-8 max-w-2xl text-3xl text-white">{centeredInfo.titleHeader}</h1>}
        {centeredInfo.titleSubHeader && <h1 className="mt-4 max-w-lg text-3xl text-white">{centeredInfo.titleSubHeader}</h1>}
        {centeredInfo.image && (
          <div className="relative h-40 w-full">
            <Image src={centeredInfo.image} alt="title image" fill sizes={imageSizes({ base: "100vw", lg: "100vw" })} className="object-contain"  />
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutInfoBanner;
