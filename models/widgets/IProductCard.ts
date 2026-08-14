import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface IProductCard {
  images: {
    url: string;
    alt: string;
  }[];
  tags: {
    tag: string;
    icon?: {
      url: string;
      alt: string;
    };
  }[];
  description?: Pick<StoryblokRichTextProps, "doc">;
}
