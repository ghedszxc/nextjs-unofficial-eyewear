import type { Meta, StoryObj } from "@storybook/react";

import HeroSection from "@/widgets/HeroSection";
import { StoryblokRichTextNodeTypes } from "@storyblok/react";
import { IHeroSection } from "@/models/widgets/IHeroSection";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Widgets/HeroSection",
  component: HeroSection,
  tags: ["autodocs"],
} satisfies Meta<IHeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    title1: "HELLO.",
    title2: "NICE TO SEE YOU.",
    body: {
      doc: {
        type: "doc" as StoryblokRichTextNodeTypes,
        content: [
          {
            type: "paragraph" as StoryblokRichTextNodeTypes,
            attrs: {
              dir: "ltr",
            },
            content: [
              {
                text: "Unofficial is an invitation for self expression.",
                // @ts-ignore
                type: "text",
              },
            ],
          },
        ],
      },
    },
    visual: {
      desktop: {
        url: "/images/hero-section-image-d.png",
        alt: "Visual Image Type 1",
        type: "image",
      },
      mobile: {
        url: "/images/hero-section-image-m.png",
        alt: "Visual Image Type 1",
        type: "image",
      },
    },
    icon: { url: "/icons/arrow-down.svg", alt: "Arrow down" },
    link: {
      type: "anchor",
      href: "#",
      text: "DISCOVER STYLES",
    },
    isVideo: false,
  },
};
