import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface ITwoColumnTextAndMedia {
  image?: {
    desktop?: { url?: string; alt?: string };
    mobile?: { url?: string; alt?: string };
  };
  title?: string;
  titleMobile?: string;
  subtitle?: Pick<StoryblokRichTextProps, "doc">;
  ctas?: Array<{ text?: string; href?: string }>;
  imagePosition?: "left" | "right";
  bgColor?: string;
  outerBgColor?: string;
  pt?: string;
  ctaWidth?: string;
  ctaLayout?: "block" | "inline";
  maxWidth?: string;
  productCtas?: Array<{ text?: string; label?: string; href?: string; ctaColor?: string; thumbnail?: string; icon?: string }>;
  containerHeight?: string;
  responsiveImage?: boolean;
}
