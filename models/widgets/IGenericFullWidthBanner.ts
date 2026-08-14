import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface IGenericFullWidthBanner {
  title?: string;
  body?: Pick<StoryblokRichTextProps, "doc">;
  image?: {
    desktop?: { src?: string; alt?: string };
    mobile?: { src?: string; alt?: string };
  };
  cta?: {
    text?: string;
    href?: string;
  };
  theme?: "light" | "dark";
}
