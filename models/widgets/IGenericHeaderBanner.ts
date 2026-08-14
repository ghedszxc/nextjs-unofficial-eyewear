import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface IGenericHeaderBanner {
  title?: string;
  body?: Pick<StoryblokRichTextProps, "doc">;
  cta?: {
    text?: string;
    href?: string;
  };
  theme?: "light" | "dark";
  topPadding?: boolean;
  bottomPadding?: string;
  ctaWidth?: string;
}
