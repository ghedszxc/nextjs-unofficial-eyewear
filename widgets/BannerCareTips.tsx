import React from "react";
import { ICareTipsBanner } from "@/models/widgets/ICareTipsBanner";

const BannerCareTips = ({ heading, subtitle }: ICareTipsBanner) => {
  return (
    <section className="bg-white px-6 pt-24 pb-8 lg:px-20 lg:pt-28 lg:pb-10">
      <div className="mx-auto max-w-5xl xl:max-w-full text-left">
        {heading && (
          <h2 className="font-gt-america-standard-regular mb-3 mt-[80px] text-4xl lg:text-5xl text-black sm:block">
            {heading}
          </h2>
        )}
        {subtitle && (
          <p className="font-gt-america-standard-regular mt-[24px] text-lg lg:text-2xl text-black sm:block">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default BannerCareTips;
