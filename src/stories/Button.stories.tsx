import type { Meta, StoryObj } from "@storybook/react";
import { DrawLightning } from "./drawLightning";
import { Canvas } from "./Stage";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/Lightning",
  component: () => {
    return (
      <Canvas>
        <DrawLightning start={{ x: 400, y: 100 }} end={{ x: 800, y: 600 }} />
      </Canvas>
    );
  },
} satisfies Meta<typeof DrawLightning>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {};
