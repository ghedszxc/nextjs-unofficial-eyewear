import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface IFaqAccordion {
  collectionTitle: string;
  items: IFaqAccordionItem[];
  pb?: string;
}

export interface IFaqAccordionItem {
  question: string;
  answer: Pick<StoryblokRichTextProps, "doc">;
}
