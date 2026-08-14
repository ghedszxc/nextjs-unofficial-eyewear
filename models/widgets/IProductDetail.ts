import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface IProductDetail {
  product: {
    image: string;
    tags: {
      gender: string;
      material: string;
      reference: string;
    };
    description?: Pick<StoryblokRichTextProps, "doc">;
  };
}
