import { IHomeWTB } from "@/models/widgets/IHomeWTB";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HomeWTB = ({ title, description, actionButton }: IHomeWTB) => {
  return (
    <div className="flex flex-col items-center p-8 text-center md:px-12 xl:my-15">
      {title && <h1 className="text-5xl font-bold tracking-wider">{title}</h1>}
      {description && <p className="mt-8 max-w-lg text-lg text-gray-500 md:text-base">{description}</p>}
      {actionButton?.text && (
        <Button asChild size="lg" className="md:text-md mt-8 rounded-full bg-black px-8 py-3 font-bold">
          <Link href={actionButton.targetUrl} target="_blank" rel="noopener noreferrer">
            {actionButton.text}
          </Link>
        </Button>
      )}
    </div>
  );
};

export default HomeWTB;
