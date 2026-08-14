import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface ISectionHeader {
  title: string;
  subtitle?: Pick<StoryblokRichTextProps, "doc">;
  withSubtitle?: boolean;
  cta?: {
    text?: string;
    href?: string;
  };
  maxWidth?: string;
  titleFontSize?: string;
  titleFontSizeMobile?: string;
  titleFontFamily?: string;
  paddingTop?: string;
}
