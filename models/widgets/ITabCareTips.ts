import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface ITabCareTips {
  tabs: ICareTipsTab[];
}

export interface ICareTipsTab {
  tabName: string;
  tabContent: Pick<StoryblokRichTextProps, "doc">;
  image?: {
    url: string;
    alt: string;
  };
  icon?: {
    url: string;
    alt: string;
  };
  cta?: {
    href: string;
    text: string;
  };
}
