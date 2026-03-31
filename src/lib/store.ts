import { create } from "zustand";

export type AspectRatio = "9:16" | "4:5" | "1:1";
export type MediaType = "video" | "image";

export type KenBurnsPreset =
  | "zoom-in"
  | "zoom-out"
  | "pan-left"
  | "pan-right"
  | "pan-up"
  | "pan-down"
  | "drift-diagonal-tl"
  | "drift-diagonal-tr"
  | "drift-diagonal-bl"
  | "drift-diagonal-br"
  | "zoom-in-pan-left"
  | "zoom-in-pan-right"
  | "zoom-out-pan-up"
  | "zoom-out-drift"
  | "slow-push"
  | "pull-reveal"
  | "none";

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: "Cormorant Garamond" | "Josefin Sans";
  fontWeight: number;
  letterSpacing: number;
  color: string;
  opacity: number;
}

export interface FilterSettings {
  warmth: number;
  contrast: number;
  saturation: number;
  shadowLift: number;
  brightness: number;
  grain: number;
  vignette: number;
  speed: number;
}

export const AMAN_PRESETS: Record<string, FilterSettings> = {
  "Aman Classic": {
    warmth: 0.3,
    contrast: 0.92,
    saturation: 0.75,
    shadowLift: 0.08,
    brightness: 1.02,
    grain: 0.03,
    vignette: 0.25,
    speed: 0.8,
  },
  "Golden Hour": {
    warmth: 0.5,
    contrast: 0.88,
    saturation: 0.7,
    shadowLift: 0.12,
    brightness: 1.05,
    grain: 0.04,
    vignette: 0.3,
    speed: 0.7,
  },
  "Stone & Water": {
    warmth: 0.15,
    contrast: 0.95,
    saturation: 0.65,
    shadowLift: 0.06,
    brightness: 0.98,
    grain: 0.02,
    vignette: 0.2,
    speed: 0.85,
  },
  "Desert Dusk": {
    warmth: 0.45,
    contrast: 0.85,
    saturation: 0.6,
    shadowLift: 0.15,
    brightness: 1.0,
    grain: 0.05,
    vignette: 0.35,
    speed: 0.6,
  },
  "Zen Garden": {
    warmth: 0.2,
    contrast: 0.9,
    saturation: 0.55,
    shadowLift: 0.1,
    brightness: 1.0,
    grain: 0.02,
    vignette: 0.15,
    speed: 0.75,
  },
  "Misty Landscape": {
    warmth: 0.18,
    contrast: 0.82,
    saturation: 0.5,
    shadowLift: 0.18,
    brightness: 1.08,
    grain: 0.03,
    vignette: 0.1,
    speed: 0.65,
  },
  "Sand & Clay": {
    warmth: 0.55,
    contrast: 0.9,
    saturation: 0.6,
    shadowLift: 0.1,
    brightness: 1.03,
    grain: 0.04,
    vignette: 0.2,
    speed: 0.75,
  },
  "Ocean Calm": {
    warmth: 0.08,
    contrast: 0.88,
    saturation: 0.6,
    shadowLift: 0.12,
    brightness: 1.05,
    grain: 0.02,
    vignette: 0.18,
    speed: 0.7,
  },
  "Candlelight": {
    warmth: 0.6,
    contrast: 0.85,
    saturation: 0.55,
    shadowLift: 0.2,
    brightness: 0.95,
    grain: 0.05,
    vignette: 0.4,
    speed: 0.6,
  },
  "Morning Mist": {
    warmth: 0.25,
    contrast: 0.78,
    saturation: 0.45,
    shadowLift: 0.22,
    brightness: 1.1,
    grain: 0.02,
    vignette: 0.08,
    speed: 0.7,
  },
};

export interface TextTemplate {
  name: string;
  description: string;
  overlays: Omit<TextOverlay, "id">[];
}

export const TEXT_TEMPLATES: TextTemplate[] = [
  {
    name: "Property Name",
    description: "Center — Large brand name",
    overlays: [
      {
        text: "AMAN TOKYO",
        x: 50, y: 50,
        fontSize: 36,
        fontFamily: "Josefin Sans",
        fontWeight: 200,
        letterSpacing: 20,
        color: "#F5F0EB",
        opacity: 0.95,
      },
    ],
  },
  {
    name: "Location + Tagline",
    description: "Name top, tagline bottom",
    overlays: [
      {
        text: "AMANPURI",
        x: 50, y: 15,
        fontSize: 28,
        fontFamily: "Josefin Sans",
        fontWeight: 200,
        letterSpacing: 18,
        color: "#F5F0EB",
        opacity: 0.9,
      },
      {
        text: "Where the spirit finds peace",
        x: 50, y: 85,
        fontSize: 14,
        fontFamily: "Cormorant Garamond",
        fontWeight: 300,
        letterSpacing: 4,
        color: "#F5F0EB",
        opacity: 0.75,
      },
    ],
  },
  {
    name: "Destination",
    description: "Country + property centered",
    overlays: [
      {
        text: "JAPAN",
        x: 50, y: 42,
        fontSize: 12,
        fontFamily: "Josefin Sans",
        fontWeight: 300,
        letterSpacing: 14,
        color: "#F5F0EB",
        opacity: 0.6,
      },
      {
        text: "AMAN KYOTO",
        x: 50, y: 50,
        fontSize: 32,
        fontFamily: "Josefin Sans",
        fontWeight: 200,
        letterSpacing: 16,
        color: "#F5F0EB",
        opacity: 0.95,
      },
      {
        text: "A garden of hidden treasures",
        x: 50, y: 58,
        fontSize: 12,
        fontFamily: "Cormorant Garamond",
        fontWeight: 300,
        letterSpacing: 3,
        color: "#F5F0EB",
        opacity: 0.65,
      },
    ],
  },
  {
    name: "Quote",
    description: "Poetic quote centered",
    overlays: [
      {
        text: "Peace is found in stillness",
        x: 50, y: 50,
        fontSize: 22,
        fontFamily: "Cormorant Garamond",
        fontWeight: 300,
        letterSpacing: 3,
        color: "#F5F0EB",
        opacity: 0.85,
      },
    ],
  },
  {
    name: "Bottom Bar",
    description: "Subtle text at bottom",
    overlays: [
      {
        text: "AMAN",
        x: 50, y: 92,
        fontSize: 14,
        fontFamily: "Josefin Sans",
        fontWeight: 200,
        letterSpacing: 20,
        color: "#F5F0EB",
        opacity: 0.5,
      },
    ],
  },
  {
    name: "Season / Event",
    description: "Season label + place name",
    overlays: [
      {
        text: "SPRING 2026",
        x: 50, y: 40,
        fontSize: 10,
        fontFamily: "Josefin Sans",
        fontWeight: 300,
        letterSpacing: 12,
        color: "#F5F0EB",
        opacity: 0.55,
      },
      {
        text: "AMAN VENICE",
        x: 50, y: 48,
        fontSize: 30,
        fontFamily: "Josefin Sans",
        fontWeight: 200,
        letterSpacing: 16,
        color: "#F5F0EB",
        opacity: 0.95,
      },
      {
        text: "Experience the extraordinary",
        x: 50, y: 56,
        fontSize: 13,
        fontFamily: "Cormorant Garamond",
        fontWeight: 300,
        letterSpacing: 3,
        color: "#F5F0EB",
        opacity: 0.65,
      },
    ],
  },
  {
    name: "Minimal Logo",
    description: "Small AMAN watermark center",
    overlays: [
      {
        text: "AMAN",
        x: 50, y: 50,
        fontSize: 18,
        fontFamily: "Josefin Sans",
        fontWeight: 200,
        letterSpacing: 24,
        color: "#F5F0EB",
        opacity: 0.4,
      },
    ],
  },
  {
    name: "No Text",
    description: "Clear all text overlays",
    overlays: [],
  },
];

interface EditorState {
  videoFile: File | null;
  videoUrl: string | null;
  mediaType: MediaType;
  aspectRatio: AspectRatio;
  filter: FilterSettings;
  textOverlays: TextOverlay[];
  activePreset: string;
  isExporting: boolean;
  exportProgress: number;
  showEndCard: boolean;
  kenBurns: KenBurnsPreset;
  photoDuration: number;

  setMediaFile: (file: File) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setKenBurns: (kb: KenBurnsPreset) => void;
  setPhotoDuration: (d: number) => void;
  setFilter: (filter: Partial<FilterSettings>) => void;
  setPreset: (name: string) => void;
  addTextOverlay: () => void;
  setTextOverlays: (overlays: TextOverlay[]) => void;
  applyTextTemplate: (template: TextTemplate) => void;
  updateTextOverlay: (id: string, update: Partial<TextOverlay>) => void;
  removeTextOverlay: (id: string) => void;
  setIsExporting: (v: boolean) => void;
  setExportProgress: (v: number) => void;
  setShowEndCard: (v: boolean) => void;
  reset: () => void;
}

const defaultFilter = AMAN_PRESETS["Aman Classic"];

export const useEditorStore = create<EditorState>((set) => ({
  videoFile: null,
  videoUrl: null,
  mediaType: "video",
  aspectRatio: "9:16",
  filter: { ...defaultFilter },
  textOverlays: [],
  activePreset: "Aman Classic",
  isExporting: false,
  exportProgress: 0,
  showEndCard: true,
  kenBurns: "none",
  photoDuration: 5,

  setMediaFile: (file) =>
    set((state) => {
      if (state.videoUrl) URL.revokeObjectURL(state.videoUrl);
      const mediaType: MediaType = file.type.startsWith("image/") ? "image" : "video";
      return { videoFile: file, videoUrl: URL.createObjectURL(file), mediaType };
    }),

  setAspectRatio: (ratio) => set({ aspectRatio: ratio }),

  setFilter: (partial) =>
    set((state) => ({ filter: { ...state.filter, ...partial } })),

  setPreset: (name) => {
    const preset = AMAN_PRESETS[name];
    if (preset) set({ filter: { ...preset }, activePreset: name });
  },

  addTextOverlay: () =>
    set((state) => ({
      textOverlays: [
        ...state.textOverlays,
        {
          id: crypto.randomUUID(),
          text: "YOUR TEXT",
          x: 50,
          y: 50,
          fontSize: 24,
          fontFamily: "Josefin Sans",
          fontWeight: 200,
          letterSpacing: 12,
          color: "#F5F0EB",
          opacity: 0.9,
        },
      ],
    })),

  setTextOverlays: (overlays) => set({ textOverlays: overlays }),

  applyTextTemplate: (template) =>
    set({
      textOverlays: template.overlays.map((o) => ({
        ...o,
        id: crypto.randomUUID(),
      })),
    }),

  updateTextOverlay: (id, update) =>
    set((state) => ({
      textOverlays: state.textOverlays.map((t) =>
        t.id === id ? { ...t, ...update } : t
      ),
    })),

  removeTextOverlay: (id) =>
    set((state) => ({
      textOverlays: state.textOverlays.filter((t) => t.id !== id),
    })),

  setKenBurns: (kb) => set({ kenBurns: kb }),
  setPhotoDuration: (d) => set({ photoDuration: d }),
  setIsExporting: (v) => set({ isExporting: v }),
  setExportProgress: (v) => set({ exportProgress: v }),
  setShowEndCard: (v) => set({ showEndCard: v }),

  reset: () =>
    set((state) => {
      if (state.videoUrl) URL.revokeObjectURL(state.videoUrl);
      return {
        videoFile: null,
        videoUrl: null,
        mediaType: "video" as MediaType,
        filter: { ...defaultFilter },
        textOverlays: [],
        activePreset: "Aman Classic",
        isExporting: false,
        exportProgress: 0,
        kenBurns: "none" as KenBurnsPreset,
        photoDuration: 5,
      };
    }),
}));
