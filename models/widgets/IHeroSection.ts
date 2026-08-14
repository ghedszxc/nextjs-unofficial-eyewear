import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface IHeroSection {
  title1?: string;
  title2?: string;
  body?: Pick<StoryblokRichTextProps, "doc">;
  visual?: {
    desktop: { url: string; alt: string; type: "image" | "video" };
    mobile: { url: string; alt: string; type: "image" | "video" };
  };
  icon?: { url: string; alt: string };
  link?: {
    type?: "anchor" | "internal";
    href?: "#";
    text?: string;
  };
  isVideo?: boolean;
}
