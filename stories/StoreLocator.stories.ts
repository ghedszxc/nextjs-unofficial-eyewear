import type { Meta, StoryObj } from "@storybook/react";
import StoreLocator from "@/widgets/StoreLocator";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Widgets/StoreLocator",
  component: StoreLocator,
} satisfies Meta<typeof StoreLocator>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    data: {
      locatorConfig: {
        selector: "",
        locale: "",
        tenantKey: "",
      },
    },
  },
};
