import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface ITwoColumnSection {
  title?: string;
  titleMobile?: string;
  longText?: Pick<StoryblokRichTextProps, "doc">;
  bgColor?: string;
  fontColor?: string;
}
