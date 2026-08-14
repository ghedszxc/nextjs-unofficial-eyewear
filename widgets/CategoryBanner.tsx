import React from "react";
import Image from "next/image";
import { ICategoryBanner } from "@/models/widgets/ICategoryBanner";
import RichText from "@/components/RichText";

const CategoryBanner = ({ title, description, image }: ICategoryBanner) => {
  return (
    <div className="flex min-h-[100vh]">
      <div className="flex flex-1 flex-col justify-end gap-4 bg-[#efe6d7] p-32">
        {title && <h1 className="text-4xl">{title}</h1>}
        {description && (
          <RichText
            doc={{
              type: description.doc.type,
              content: description.doc.content,
            }}
          />
        )}
      </div>
      <div className="flex-1 bg-[#e3dcd2] p-32">
        {image && <Image src={image} alt="Product Image" width={488} height={544}  />}
      </div>
    </div>
  );
};
export default CategoryBanner;
