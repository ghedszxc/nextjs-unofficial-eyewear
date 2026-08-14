import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface ICategoryBanner {
  title: string;
  description?: Pick<StoryblokRichTextProps, "doc">;
  image: string;
}
