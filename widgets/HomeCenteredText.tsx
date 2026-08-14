import { Button } from "@/components/ui/button";
import { IHomeCenteredText } from "@/models/widgets/IHomeCenteredText";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HomeCenteredText = ({ title, description, actionButton }: IHomeCenteredText) => {
  return (
    <div className="flex flex-col items-center p-8 text-center md:px-12 xl:my-15">
      {title && (
        <div className="relative h-40 w-full">
          <Image src={title} alt="title image" fill sizes="100vw" className="object-contain" />
        </div>
      )}
      {description && <p className="mt-8 max-w-lg text-lg text-gray-500 md:text-base">{description}</p>}
      {actionButton?.text && (
        <Button asChild size="lg" className="md:text-md mt-8 rounded-full bg-black px-8 py-3 font-bold">
          <Link href={actionButton.targetUrl}>{actionButton.text}</Link>
        </Button>
      )}
    </div>
  );
};

export default HomeCenteredText;
