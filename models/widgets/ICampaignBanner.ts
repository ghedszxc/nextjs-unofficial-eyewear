import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface ICampaignBanner {
  title?: string;
  body?: Pick<StoryblokRichTextProps, "doc">;
  image?: {
    desktop?: { url?: string; alt?: string };
    mobile?: { url?: string; alt?: string };
  };
  cta?: {
    text?: string;
    href?: string;
  };
  theme?: "light" | "dark";
  bodyMaxWidth?: string;
}
