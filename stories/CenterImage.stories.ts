import type { Meta, StoryObj } from "@storybook/react";
import CenterImage from "@/widgets/CenterImage";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Widgets/CenterImage",
  component: CenterImage,
} satisfies Meta<typeof CenterImage>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    image: {
      url: "/images/center-image.png",
      alt: "Center Image",
    },
    link: {
      url: "#",
      text: "STYLE NAME",
    },
    text: "FOR WHO",
    icon: { url: "/icons/arrow-right.svg", alt: "Arrow right" },
  },
};
