import { StoryblokRichTextProps } from "@storyblok/react/rsc";
export interface IFAQ {
  collectionTitle: string;
  collection: {
    title: string;
    description: Pick<StoryblokRichTextProps, "doc">;
  }[];
}
