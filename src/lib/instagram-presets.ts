import { AspectRatio } from "./store";

export interface FormatPreset {
  label: string;
  width: number;
  height: number;
  description: string;
}

export const FORMAT_PRESETS: Record<AspectRatio, FormatPreset> = {
  "9:16": {
    label: "Reels / Stories",
    width: 1080,
    height: 1920,
    description: "Instagram Reels & Stories",
  },
  "4:5": {
    label: "Feed Post",
    width: 1080,
    height: 1350,
    description: "Instagram Feed (Portrait)",
  },
  "1:1": {
    label: "Square",
    width: 1080,
    height: 1080,
    description: "Instagram Feed (Square)",
  },
};
