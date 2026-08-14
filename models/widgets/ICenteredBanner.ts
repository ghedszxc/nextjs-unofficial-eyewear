import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface ICenteredBanner {
  title?: string;
  body?: Pick<StoryblokRichTextProps, "doc">;
  name?: string;
  image?: {
    desktop?: { url?: string; alt?: string; mediaType?: "image" | "video" };
    mobile?: { url?: string; alt?: string; mediaType?: "image" | "video" };
  };
  cta?: {
    text?: string;
    href?: string;
  };
  noTeaserText?: boolean;
  imageHeight?: string;
  mobileImageHeight?: string;
  responsiveImage?: boolean;
  containerHeight?: string;
}
