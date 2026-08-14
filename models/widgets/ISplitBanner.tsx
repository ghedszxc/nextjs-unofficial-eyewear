import { StoryblokRichTextProps } from "@storyblok/react";

export interface ISplitBanner {
  layout_variant: "split-left" | "split-right";
  image?: {
    desktop?: { src?: string; alt?: string };
    mobile?: { src?: string; alt?: string };
  };
  title?: string;
  body?: Pick<StoryblokRichTextProps, "doc">;
  subtext?: Pick<StoryblokRichTextProps, "doc">;
  cta?: { text?: string; href?: string };
  background_color?: string;
  tabs?: { key: string; label: string; title: string; body?: string; }[]; // optional for the right variant
};
