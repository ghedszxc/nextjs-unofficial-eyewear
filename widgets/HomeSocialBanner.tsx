import { IHomeSocialBanner } from "@/models/widgets/IHomeSocialBanner";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HomeSocialBanner = ({ image, actionButton }: IHomeSocialBanner) => {
  return (
    <div className="relative mx-15 h-[60vh] overflow-hidden md:h-[77vh]">
      <Image src={image} alt="social banner" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center px-4">
        <Button asChild size="lg" className="cursor-pointer rounded-full bg-white font-bold text-black">
          <Link href={actionButton.targetUrl} target="_blank" rel="noopener noreferrer">
            <span className="px-6 py-2 md:px-8 md:py-3">{actionButton.text}</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HomeSocialBanner;
