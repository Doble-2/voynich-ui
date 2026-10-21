import type { Meta, StoryObj } from "@storybook/react";
import { VoynichWelcome } from "./VoynichWelcome";

const meta = {
  title: "Welcome",
  component: VoynichWelcome,
  parameters: {
    layout: "fullscreen",
    // Hide all addon panels & toolbars for the immersive welcome experience
    controls: { disable: true },
    actions: { disable: true },
    backgrounds: { disable: true },
    viewport: { disable: true },
    docs: { disable: true },
    // Hide bottom panel entirely
    options: { showPanel: false },
    // Disable Storybook's default padding
    paddings: { disable: true },
  },
  // No decorators — VoynichWelcome manages its own layout
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof VoynichWelcome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
