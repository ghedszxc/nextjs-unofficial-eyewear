import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface ITwoColumnTextItem {
  title?: string;
  subtitle?: Pick<StoryblokRichTextProps, "doc">;
  cta?: {
    text?: string;
    href?: string;
  };
}

export interface ITwoColumnText {
  columns?: ITwoColumnTextItem[];
}
