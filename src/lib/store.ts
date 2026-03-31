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
    warmth: 0.3, contrast: 0.92, saturation: 0.75, shadowLift: 0.08,
    brightness: 1.02, grain: 0.03, vignette: 0.25, speed: 0.8,
  },
  "Golden Hour": {
    warmth: 0.5, contrast: 0.88, saturation: 0.7, shadowLift: 0.12,
    brightness: 1.05, grain: 0.04, vignette: 0.3, speed: 0.7,
  },
  "Stone & Water": {
    warmth: 0.15, contrast: 0.95, saturation: 0.65, shadowLift: 0.06,
    brightness: 0.98, grain: 0.02, vignette: 0.2, speed: 0.85,
  },
  "Desert Dusk": {
    warmth: 0.45, contrast: 0.85, saturation: 0.6, shadowLift: 0.15,
    brightness: 1.0, grain: 0.05, vignette: 0.35, speed: 0.6,
  },
  "Zen Garden": {
    warmth: 0.2, contrast: 0.9, saturation: 0.55, shadowLift: 0.1,
    brightness: 1.0, grain: 0.02, vignette: 0.15, speed: 0.75,
  },
  "Misty Landscape": {
    warmth: 0.18, contrast: 0.82, saturation: 0.5, shadowLift: 0.18,
    brightness: 1.08, grain: 0.03, vignette: 0.1, speed: 0.65,
  },
  "Sand & Clay": {
    warmth: 0.55, contrast: 0.9, saturation: 0.6, shadowLift: 0.1,
    brightness: 1.03, grain: 0.04, vignette: 0.2, speed: 0.75,
  },
  "Ocean Calm": {
    warmth: 0.08, contrast: 0.88, saturation: 0.6, shadowLift: 0.12,
    brightness: 1.05, grain: 0.02, vignette: 0.18, speed: 0.7,
  },
  "Candlelight": {
    warmth: 0.6, contrast: 0.85, saturation: 0.55, shadowLift: 0.2,
    brightness: 0.95, grain: 0.05, vignette: 0.4, speed: 0.6,
  },
  "Morning Mist": {
    warmth: 0.25, contrast: 0.78, saturation: 0.45, shadowLift: 0.22,
    brightness: 1.1, grain: 0.02, vignette: 0.08, speed: 0.7,
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
      { text: "AMAN TOKYO", x: 50, y: 50, fontSize: 36, fontFamily: "Josefin Sans", fontWeight: 200, letterSpacing: 20, color: "#F5F0EB", opacity: 0.95 },
    ],
  },
  {
    name: "Location + Tagline",
    description: "Name top, tagline bottom",
    overlays: [
      { text: "AMANPURI", x: 50, y: 15, fontSize: 28, fontFamily: "Josefin Sans", fontWeight: 200, letterSpacing: 18, color: "#F5F0EB", opacity: 0.9 },
      { text: "Where the spirit finds peace", x: 50, y: 85, fontSize: 14, fontFamily: "Cormorant Garamond", fontWeight: 300, letterSpacing: 4, color: "#F5F0EB", opacity: 0.75 },
    ],
  },
  {
    name: "Destination",
    description: "Country + property centered",
    overlays: [
      { text: "JAPAN", x: 50, y: 42, fontSize: 12, fontFamily: "Josefin Sans", fontWeight: 300, letterSpacing: 14, color: "#F5F0EB", opacity: 0.6 },
      { text: "AMAN KYOTO", x: 50, y: 50, fontSize: 32, fontFamily: "Josefin Sans", fontWeight: 200, letterSpacing: 16, color: "#F5F0EB", opacity: 0.95 },
      { text: "A garden of hidden treasures", x: 50, y: 58, fontSize: 12, fontFamily: "Cormorant Garamond", fontWeight: 300, letterSpacing: 3, color: "#F5F0EB", opacity: 0.65 },
    ],
  },
  {
    name: "Quote",
    description: "Poetic quote centered",
    overlays: [
      { text: "Peace is found in stillness", x: 50, y: 50, fontSize: 22, fontFamily: "Cormorant Garamond", fontWeight: 300, letterSpacing: 3, color: "#F5F0EB", opacity: 0.85 },
    ],
  },
  {
    name: "Bottom Bar",
    description: "Subtle text at bottom",
    overlays: [
      { text: "AMAN", x: 50, y: 92, fontSize: 14, fontFamily: "Josefin Sans", fontWeight: 200, letterSpacing: 20, color: "#F5F0EB", opacity: 0.5 },
    ],
  },
  {
    name: "Season / Event",
    description: "Season label + place name",
    overlays: [
      { text: "SPRING 2026", x: 50, y: 40, fontSize: 10, fontFamily: "Josefin Sans", fontWeight: 300, letterSpacing: 12, color: "#F5F0EB", opacity: 0.55 },
      { text: "AMAN VENICE", x: 50, y: 48, fontSize: 30, fontFamily: "Josefin Sans", fontWeight: 200, letterSpacing: 16, color: "#F5F0EB", opacity: 0.95 },
      { text: "Experience the extraordinary", x: 50, y: 56, fontSize: 13, fontFamily: "Cormorant Garamond", fontWeight: 300, letterSpacing: 3, color: "#F5F0EB", opacity: 0.65 },
    ],
  },
  {
    name: "Minimal Logo",
    description: "Small AMAN watermark center",
    overlays: [
      { text: "AMAN", x: 50, y: 50, fontSize: 18, fontFamily: "Josefin Sans", fontWeight: 200, letterSpacing: 24, color: "#F5F0EB", opacity: 0.4 },
    ],
  },
  {
    name: "No Text",
    description: "Clear all text overlays",
    overlays: [],
  },
];

// --- Slide-based architecture ---

export interface Slide {
  id: string;
  file: File | null;
  url: string | null;
  mediaType: MediaType;
  filter: FilterSettings;
  activePreset: string;
  textOverlays: TextOverlay[];
  kenBurns: KenBurnsPreset;
  photoDuration: number;
  cropOffsetX: number;
  cropOffsetY: number;
  showEndCard: boolean;
  thumbnailUrl: string | null;
}

const defaultFilter = AMAN_PRESETS["Aman Classic"];

function createSlide(file: File | null, url: string | null, mediaType: MediaType): Slide {
  return {
    id: crypto.randomUUID(),
    file, url, mediaType,
    filter: { ...defaultFilter },
    activePreset: "Aman Classic",
    textOverlays: [],
    kenBurns: "none",
    photoDuration: 5,
    cropOffsetX: 0,
    cropOffsetY: 0,
    showEndCard: false,
    thumbnailUrl: null,
  };
}

function updateActiveSlide(state: EditorState, update: Partial<Slide>): Partial<EditorState> {
  const slides = [...state.slides];
  slides[state.activeSlideIndex] = { ...slides[state.activeSlideIndex], ...update };
  return { slides };
}

interface EditorState {
  slides: Slide[];
  activeSlideIndex: number;
  aspectRatio: AspectRatio;
  isExporting: boolean;
  exportProgress: number;
  exportingSlideLabel: string;

  // Slide management
  addSlide: (file: File) => void;
  addSlides: (files: File[]) => void;
  removeSlide: (index: number) => void;
  setActiveSlide: (index: number) => void;
  reorderSlides: (from: number, to: number) => void;
  splitPanorama: (file: File, sliceCount: 2 | 3, blobs: Blob[]) => void;

  // Per-slide actions (operate on active slide)
  setFilter: (filter: Partial<FilterSettings>) => void;
  setPreset: (name: string) => void;
  applyFilterToAll: () => void;
  addTextOverlay: () => void;
  applyTextTemplate: (template: TextTemplate) => void;
  updateTextOverlay: (id: string, update: Partial<TextOverlay>) => void;
  removeTextOverlay: (id: string) => void;
  setCropOffset: (x: number, y: number) => void;
  setKenBurns: (kb: KenBurnsPreset) => void;
  setPhotoDuration: (d: number) => void;
  setShowEndCard: (v: boolean) => void;
  setThumbnail: (index: number, url: string) => void;

  // Global
  setAspectRatio: (ratio: AspectRatio) => void;
  setIsExporting: (v: boolean) => void;
  setExportProgress: (v: number, label?: string) => void;
  reset: () => void;
}

// Convenience selectors
export const useActiveSlide = () =>
  useEditorStore((s) => s.slides[s.activeSlideIndex] ?? null);

export const useEditorStore = create<EditorState>((set) => ({
  slides: [],
  activeSlideIndex: 0,
  aspectRatio: "9:16",
  isExporting: false,
  exportProgress: 0,
  exportingSlideLabel: "",

  addSlide: (file) =>
    set((state) => {
      const mediaType: MediaType = file.type.startsWith("image/") ? "image" : "video";
      const url = URL.createObjectURL(file);
      const slide = createSlide(file, url, mediaType);
      return {
        slides: [...state.slides, slide],
        activeSlideIndex: state.slides.length,
      };
    }),

  addSlides: (files) =>
    set((state) => {
      const newSlides = files.map((file) => {
        const mediaType: MediaType = file.type.startsWith("image/") ? "image" : "video";
        return createSlide(file, URL.createObjectURL(file), mediaType);
      });
      return {
        slides: [...state.slides, ...newSlides],
        activeSlideIndex: state.slides.length, // select first new slide
      };
    }),

  removeSlide: (index) =>
    set((state) => {
      const slide = state.slides[index];
      if (slide?.url) URL.revokeObjectURL(slide.url);
      const slides = state.slides.filter((_, i) => i !== index);
      let activeSlideIndex = state.activeSlideIndex;
      if (activeSlideIndex >= slides.length) activeSlideIndex = Math.max(0, slides.length - 1);
      return { slides, activeSlideIndex };
    }),

  setActiveSlide: (index) => set({ activeSlideIndex: index }),

  reorderSlides: (from, to) =>
    set((state) => {
      const slides = [...state.slides];
      const [moved] = slides.splice(from, 1);
      slides.splice(to, 0, moved);
      let activeSlideIndex = state.activeSlideIndex;
      if (activeSlideIndex === from) activeSlideIndex = to;
      else if (from < activeSlideIndex && to >= activeSlideIndex) activeSlideIndex--;
      else if (from > activeSlideIndex && to <= activeSlideIndex) activeSlideIndex++;
      return { slides, activeSlideIndex };
    }),

  splitPanorama: (file, sliceCount, blobs) =>
    set((state) => {
      const newSlides = blobs.map((blob) => {
        const sliceFile = new File([blob], file.name, { type: "image/png" });
        return createSlide(sliceFile, URL.createObjectURL(blob), "image");
      });
      return {
        slides: [...state.slides, ...newSlides],
        activeSlideIndex: state.slides.length,
      };
    }),

  // --- Per-slide actions ---

  setFilter: (partial) =>
    set((state) => {
      const slide = state.slides[state.activeSlideIndex];
      if (!slide) return {};
      return updateActiveSlide(state, { filter: { ...slide.filter, ...partial } });
    }),

  setPreset: (name) =>
    set((state) => {
      const preset = AMAN_PRESETS[name];
      if (!preset || !state.slides[state.activeSlideIndex]) return {};
      return updateActiveSlide(state, { filter: { ...preset }, activePreset: name });
    }),

  applyFilterToAll: () =>
    set((state) => {
      const active = state.slides[state.activeSlideIndex];
      if (!active) return {};
      return {
        slides: state.slides.map((s) => ({
          ...s,
          filter: { ...active.filter },
          activePreset: active.activePreset,
        })),
      };
    }),

  addTextOverlay: () =>
    set((state) => {
      const slide = state.slides[state.activeSlideIndex];
      if (!slide) return {};
      return updateActiveSlide(state, {
        textOverlays: [
          ...slide.textOverlays,
          {
            id: crypto.randomUUID(),
            text: "YOUR TEXT", x: 50, y: 50, fontSize: 24,
            fontFamily: "Josefin Sans", fontWeight: 200, letterSpacing: 12,
            color: "#F5F0EB", opacity: 0.9,
          },
        ],
      });
    }),

  applyTextTemplate: (template) =>
    set((state) => {
      if (!state.slides[state.activeSlideIndex]) return {};
      return updateActiveSlide(state, {
        textOverlays: template.overlays.map((o) => ({ ...o, id: crypto.randomUUID() })),
      });
    }),

  updateTextOverlay: (id, update) =>
    set((state) => {
      const slide = state.slides[state.activeSlideIndex];
      if (!slide) return {};
      return updateActiveSlide(state, {
        textOverlays: slide.textOverlays.map((t) => (t.id === id ? { ...t, ...update } : t)),
      });
    }),

  removeTextOverlay: (id) =>
    set((state) => {
      const slide = state.slides[state.activeSlideIndex];
      if (!slide) return {};
      return updateActiveSlide(state, {
        textOverlays: slide.textOverlays.filter((t) => t.id !== id),
      });
    }),

  setCropOffset: (x, y) =>
    set((state) => {
      if (!state.slides[state.activeSlideIndex]) return {};
      return updateActiveSlide(state, {
        cropOffsetX: Math.max(-1, Math.min(1, x)),
        cropOffsetY: Math.max(-1, Math.min(1, y)),
      });
    }),

  setKenBurns: (kb) =>
    set((state) => {
      if (!state.slides[state.activeSlideIndex]) return {};
      return updateActiveSlide(state, { kenBurns: kb });
    }),

  setPhotoDuration: (d) =>
    set((state) => {
      if (!state.slides[state.activeSlideIndex]) return {};
      return updateActiveSlide(state, { photoDuration: d });
    }),

  setShowEndCard: (v) =>
    set((state) => {
      if (!state.slides[state.activeSlideIndex]) return {};
      return updateActiveSlide(state, { showEndCard: v });
    }),

  setThumbnail: (index, url) =>
    set((state) => {
      const slides = [...state.slides];
      if (!slides[index]) return {};
      slides[index] = { ...slides[index], thumbnailUrl: url };
      return { slides };
    }),

  // --- Global ---

  setAspectRatio: (ratio) => set({ aspectRatio: ratio }),
  setIsExporting: (v) => set({ isExporting: v }),
  setExportProgress: (v, label) => set({ exportProgress: v, ...(label !== undefined ? { exportingSlideLabel: label } : {}) }),

  reset: () =>
    set((state) => {
      for (const s of state.slides) {
        if (s.url) URL.revokeObjectURL(s.url);
      }
      return {
        slides: [],
        activeSlideIndex: 0,
        isExporting: false,
        exportProgress: 0,
        exportingSlideLabel: "",
      };
    }),
}));
