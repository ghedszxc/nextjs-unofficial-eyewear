import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface IProductBanner {
  banner: Pick<StoryblokRichTextProps, "doc">;
  cta: {
    text: string;
    href: string;
  };
}
