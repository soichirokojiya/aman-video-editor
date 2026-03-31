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
  kenBurns: "zoom-in",
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
        kenBurns: "zoom-in" as KenBurnsPreset,
        photoDuration: 5,
      };
    }),
}));
