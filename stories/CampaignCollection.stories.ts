import type { Meta, StoryObj } from "@storybook/react";
import CampaignCollection from "@/widgets/CampaignCollection";
import { ICampaignCollection } from "@/models/widgets/ICampaignCollection";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Widgets/CampaignCollection",
  component: CampaignCollection,
  tags: ["autodocs"],
} satisfies Meta<ICampaignCollection>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    campaigns: [
      {
        image: {
          url: "/images/campaign-card-1.png",
          alt: "Campaign 1",
        },
        name: "Campaign 1",
        cta: {
          text: "DISCOVER MORE",
          href: "#",
        },
        icon: {
          url: "/icons/arrow-right.svg",
          alt: "Arrow right",
        },
      },
      {
        image: {
          url: "/images/campaign-card-2.png",
          alt: "Campaign 2",
        },
        name: "Campaign 2",
        cta: {
          text: "DISCOVER MORE",
          href: "#",
        },
        icon: {
          url: "/icons/arrow-right.svg",
          alt: "Arrow right",
        },
      },
      {
        image: {
          url: "/images/campaign-card-3.png",
          alt: "Campaign 3",
        },
        name: "Campaign 3",
        cta: {
          text: "DISCOVER MORE",
          href: "#",
        },
        icon: {
          url: "/icons/arrow-right.svg",
          alt: "Arrow right",
        },
      },
    ],
  },
};
