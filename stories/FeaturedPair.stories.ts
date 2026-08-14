import type { Meta, StoryObj } from "@storybook/react";
import { IFeaturedPair } from "@/models/widgets/IFeaturedPair";
import FeaturedPair from "@/widgets/FeaturedPair";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Widgets/FeaturedPair",
  component: FeaturedPair,
  tags: ["autodocs"],
} satisfies Meta<IFeaturedPair>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    cards: [
      {
        image: {
          desktop: {
            url: "/images/featured-pair-1-d.png",
            alt: "Featured Pair 1",
          },
          mobile: {
            url: "/images/featured-pair-1-m.png",
            alt: "Featured Pair 1",
          },
        },
        icon: {
          url: "/icons/arrow-right.svg",
          alt: "Arrow right",
        },
        link: {
          url: "#",
          text: "OPTICS",
        },
        subtitle: "MEN",
        position: "left",
      },
      {
        image: {
          desktop: {
            url: "/images/featured-pair-2.png",
            alt: "Featured Pair 2",
          },
        },
        icon: {
          url: "/icons/arrow-right.svg",
          alt: "Arrow right",
        },
        link: {
          url: "#",
          text: "SUN",
        },
        subtitle: "MEN & WOMEN",
        position: "right",
      },
    ],
    swap: false,
  },
};

export const Swapped: Story = {
  args: {
    cards: [
      {
        image: {
          desktop: {
            url: "/images/featured-pair-1-d.png",
            alt: "Featured Pair 1",
          },
          mobile: {
            url: "/images/featured-pair-1-m.png",
            alt: "Featured Pair 1",
          },
        },
        icon: {
          url: "/icons/arrow-right.svg",
          alt: "Arrow right",
        },
        link: {
          url: "#",
          text: "OPTICS",
        },
        subtitle: "MEN",
        position: "left",
      },
      {
        image: {
          desktop: {
            url: "/images/featured-pair-2.png",
            alt: "Featured Pair 2",
          },
        },
        icon: {
          url: "/icons/arrow-right.svg",
          alt: "Arrow right",
        },
        link: {
          url: "#",
          text: "SUN",
        },
        subtitle: "MEN & WOMEN",
        position: "right",
      },
    ],
    swap: true,
  },
};
