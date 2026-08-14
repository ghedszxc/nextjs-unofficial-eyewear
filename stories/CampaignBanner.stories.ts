import type { Meta, StoryObj } from "@storybook/react";
import { StoryblokRichTextNodeTypes } from "@storyblok/react";
import { ICampaignBanner } from "@/models/widgets/ICampaignBanner";
import CampaignBanner from "@/widgets/CampaignBanner";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Widgets/CampaignBanner",
  component: CampaignBanner,
  tags: ["autodocs"],
} satisfies Meta<ICampaignBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    title: "LATEST CAMPAIGN",
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
    image: {
      desktop: {
        url: "/images/campaign-banner-d.png",
        alt: "Campaign Banner Desktop",
      },
      mobile: {
        url: "/images/campaign-banner-m.png",
        alt: "Campaign Banner Mobile",
      },
    },
    cta: {
      text: "VIEW CAMPAIGN",
      href: "#",
    },
  },
};
