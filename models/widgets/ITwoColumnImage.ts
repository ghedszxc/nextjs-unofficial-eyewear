import { StoryblokRichTextProps } from "@storyblok/react/rsc";

type Banner = {
  desktop: { url: string; alt: string };
  mobile: { url: string; alt: string };
  label?: string;
  lightBg?: string;
  cta?: { text: string; href: string; ctaColor?: string; icon?: string; thumbnail?: string };
};

export interface ITwoColumnImage {
  left: Banner;
  right: Banner;
  title?: string;
  body?: Pick<StoryblokRichTextProps, "doc">;
  bgColor?: string;
  responsiveImage?: boolean;
  containerHeight?: string;
}
