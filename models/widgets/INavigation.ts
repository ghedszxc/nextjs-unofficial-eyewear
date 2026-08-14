import { StoryblokRichTextProps } from "@storyblok/react/rsc";

type NavItem = {
  label: string;
  href?: string;
  children?: {
    header: string;
    image?: string;
    description?: Pick<StoryblokRichTextProps, "doc">;
    ctaLabel?: string;
    ctaIcon?: string;
    href?: string;
    children?: { label: string; href: string; totalItems?: string }[];
  }[];
};

export interface INavigation {
  NavData: NavItem[];
  lang?: string;
}
