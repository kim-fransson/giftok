import { GifCard } from "./GifCard";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof GifCard> = {
  component: GifCard,
  parameters: {
    layout: "fullscreen",
  },
  args: {},
};
export default meta;

type Story = StoryObj<typeof GifCard>;

export const Default: Story = {
  args: {
    gif: {
      id: "1",
      title: "Celebrate Happy Birthday Gif by OttawaRecCulture",
      user: {
        avatar_url:
          "https://media3.giphy.com/avatars/OttawaRecCulture/bduHhRgBWtL3.jpg",
        display_name: "OttawaRecCulture",
        username: "OttawaRecCulture",
      },
      images: {
        original: {
          height: 480,
          width: 311,
          url: "https://media4.giphy.com/media/F1ydLXfbBJDscG04sn/giphy.gif?cid=d9ccbfdaq2igbj8nm5hof93m28ctofmgq4hsa9519kl949l1&ep=v1_gifs_trending&rid=giphy.gif&ct=g",
        },
      },
    },
  },
};
