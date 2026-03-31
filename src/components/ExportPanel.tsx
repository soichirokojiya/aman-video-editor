"use client";

import { useEditorStore, useActiveSlide } from "@/lib/store";
import { FORMAT_PRESETS } from "@/lib/instagram-presets";
import type { AspectRatio, KenBurnsPreset } from "@/lib/store";

const KB_GROUPS: { title: string; options: { value: KenBurnsPreset; label: string }[] }[] = [
  {
    title: "Basic",
    options: [
      { value: "zoom-in", label: "Zoom In" },
      { value: "zoom-out", label: "Zoom Out" },
      { value: "slow-push", label: "Slow Push" },
      { value: "pull-reveal", label: "Pull Reveal" },
    ],
  },
  {
    title: "Pan",
    options: [
      { value: "pan-left", label: "Left" },
      { value: "pan-right", label: "Right" },
      { value: "pan-up", label: "Up" },
      { value: "pan-down", label: "Down" },
    ],
  },
  {
    title: "Diagonal Drift",
    options: [
      { value: "drift-diagonal-tl", label: "Top Left" },
      { value: "drift-diagonal-tr", label: "Top Right" },
      { value: "drift-diagonal-bl", label: "Bottom Left" },
      { value: "drift-diagonal-br", label: "Bottom Right" },
    ],
  },
  {
    title: "Combo",
    options: [
      { value: "zoom-in-pan-left", label: "Zoom + Left" },
      { value: "zoom-in-pan-right", label: "Zoom + Right" },
      { value: "zoom-out-pan-up", label: "Out + Up" },
      { value: "zoom-out-drift", label: "Out + Drift" },
    ],
  },
  {
    title: "",
    options: [
      { value: "none", label: "None (Static)" },
    ],
  },
];

export default function ExportPanel() {
  const slide = useActiveSlide();
  const {
    aspectRatio, setAspectRatio,
    isExporting, exportProgress, exportingSlideLabel,
    slides, activeSlideIndex,
    setKenBurns, setPhotoDuration, setShowEndCard,
    setIsExporting, setExportProgress,
  } = useEditorStore();

  const mediaType = slide?.mediaType ?? "image";
  const kenBurns = slide?.kenBurns ?? "none";
  const photoDuration = slide?.photoDuration ?? 5;
  const showEndCard = slide?.showEndCard ?? false;

  const handleExportCurrent = () => {
    const glCanvas = document.querySelector("canvas") as HTMLCanvasElement;
    const textCanvas = document.querySelectorAll("canvas")[1] as HTMLCanvasElement;
    if (!glCanvas) return;

    const preset = FORMAT_PRESETS[aspectRatio];
    const outCanvas = document.createElement("canvas");
    outCanvas.width = preset.width;
    outCanvas.height = preset.height;
    const ctx = outCanvas.getContext("2d")!;

    ctx.drawImage(glCanvas, 0, 0, preset.width, preset.height);
    if (textCanvas) {
      ctx.drawImage(textCanvas, 0, 0, preset.width, preset.height);
    }

    outCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aman-slide-${activeSlideIndex + 1}-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    const totalSlides = slides.length;
    const { setActiveSlide } = useEditorStore.getState();

    for (let i = 0; i < totalSlides; i++) {
      setActiveSlide(i);
      setExportProgress(((i) / totalSlides) * 100, `Slide ${i + 1} of ${totalSlides}`);

      // Wait for render to update
      await new Promise((r) => setTimeout(r, 500));

      const glCanvas = document.querySelector("canvas") as HTMLCanvasElement;
      const textCanvas = document.querySelectorAll("canvas")[1] as HTMLCanvasElement;
      if (!glCanvas) continue;

      const preset = FORMAT_PRESETS[aspectRatio];
      const outCanvas = document.createElement("canvas");
      outCanvas.width = preset.width;
      outCanvas.height = preset.height;
      const ctx = outCanvas.getContext("2d")!;

      ctx.drawImage(glCanvas, 0, 0, preset.width, preset.height);
      if (textCanvas) {
        ctx.drawImage(textCanvas, 0, 0, preset.width, preset.height);
      }

      const blob = await new Promise<Blob | null>((resolve) =>
        outCanvas.toBlob(resolve, "image/png")
      );
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `aman-carousel-${String(i + 1).padStart(2, "0")}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }

      // Small delay between downloads
      await new Promise((r) => setTimeout(r, 300));
    }

    setExportProgress(100, "Done");
    setIsExporting(false);
  };

  return (
    <div className="space-y-5">
      {/* Aspect ratio */}
      <div>
        <h3 className="text-xs tracking-[0.3em] uppercase text-aman-stone mb-3">
          Format
        </h3>
        <div className="space-y-1.5">
          {(Object.keys(FORMAT_PRESETS) as AspectRatio[]).map((ratio) => {
            const p = FORMAT_PRESETS[ratio];
            return (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`w-full text-left px-3 py-2 text-xs tracking-wider transition-all duration-300 rounded-sm flex justify-between items-center ${
                  aspectRatio === ratio
                    ? "bg-aman-gold/20 text-aman-dark border border-aman-gold/40"
                    : "text-aman-stone hover:text-aman-dark hover:bg-aman-warm-bg border border-transparent"
                }`}
              >
                <span className="uppercase">
                  {ratio} — {p.label}
                </span>
                <span className="text-[10px] text-aman-stone/50">
                  {p.width}x{p.height}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ken Burns (photo only) */}
      {mediaType === "image" && (
        <div>
          <h3 className="text-xs tracking-[0.3em] uppercase text-aman-stone mb-3">
            Motion Effect
          </h3>
          {KB_GROUPS.map((group) => (
            <div key={group.title || "static"} className="mb-2">
              {group.title && (
                <p className="text-[9px] tracking-wider uppercase text-aman-clay mb-1">{group.title}</p>
              )}
              <div className="grid grid-cols-2 gap-1">
                {group.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setKenBurns(opt.value)}
                    className={`px-2 py-1.5 text-[10px] tracking-wider uppercase transition-all duration-300 rounded-sm ${
                      kenBurns === opt.value
                        ? "bg-aman-gold/20 text-aman-dark border border-aman-gold/40"
                        : "text-aman-stone hover:text-aman-dark hover:bg-aman-warm-bg border border-transparent"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-aman-stone tracking-wider uppercase">Duration</span>
              <span className="text-aman-gold tabular-nums">{photoDuration}s</span>
            </div>
            <input
              type="range"
              min={3}
              max={15}
              step={1}
              value={photoDuration}
              onChange={(e) => setPhotoDuration(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* End card toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-wider uppercase text-aman-stone">End Card</span>
        <button
          onClick={() => setShowEndCard(!showEndCard)}
          className={`w-10 h-5 rounded-full transition-colors duration-300 relative ${
            showEndCard ? "bg-aman-gold/50" : "bg-aman-warm-bg"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform duration-300 shadow-sm ${
              showEndCard ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* Export buttons */}
      <div className="space-y-2">
        <button
          onClick={handleExportCurrent}
          disabled={!slide || isExporting}
          className="w-full py-3 text-xs tracking-[0.3em] uppercase font-light border border-aman-gold/40 text-aman-dark hover:bg-aman-gold/15 transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-sm"
        >
          Export Current Slide
        </button>

        {slides.length > 1 && (
          <button
            onClick={handleExportAll}
            disabled={isExporting}
            className="w-full py-3 text-xs tracking-[0.3em] uppercase font-light border border-aman-gold/40 text-aman-dark hover:bg-aman-gold/15 transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-sm"
          >
            Export All Slides ({slides.length})
          </button>
        )}
      </div>

      {/* Progress */}
      {isExporting && (
        <div className="space-y-2">
          <div className="h-px bg-aman-warm-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-aman-gold transition-all duration-300"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-aman-stone text-center tracking-wider">
            {exportingSlideLabel || `${exportProgress.toFixed(0)}%`}
          </p>
        </div>
      )}
    </div>
  );
}
