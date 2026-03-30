"use client";

import { useEditorStore } from "@/lib/store";
import { FORMAT_PRESETS } from "@/lib/instagram-presets";
import type { AspectRatio, KenBurnsPreset } from "@/lib/store";

const KB_OPTIONS: { value: KenBurnsPreset; label: string }[] = [
  { value: "zoom-in", label: "Zoom In" },
  { value: "zoom-out", label: "Zoom Out" },
  { value: "pan-left", label: "Pan Left" },
  { value: "pan-right", label: "Pan Right" },
  { value: "pan-up", label: "Pan Up" },
  { value: "none", label: "None (Static)" },
];

export default function ExportPanel() {
  const {
    aspectRatio,
    setAspectRatio,
    showEndCard,
    setShowEndCard,
    isExporting,
    exportProgress,
    videoUrl,
    mediaType,
    kenBurns,
    setKenBurns,
    photoDuration,
    setPhotoDuration,
    setIsExporting,
    setExportProgress,
  } = useEditorStore();

  // Export as static image (photo only)
  const handleExportImage = () => {
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
      a.download = `aman-style-${aspectRatio.replace(":", "x")}-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  // Export as video
  const handleExportVideo = async () => {
    if (!videoUrl) return;

    setIsExporting(true);
    setExportProgress(0);

    try {
      const glCanvas = document.querySelector("canvas") as HTMLCanvasElement;
      const textCanvas = document.querySelectorAll("canvas")[1] as HTMLCanvasElement;

      if (!glCanvas) return;

      const preset = FORMAT_PRESETS[aspectRatio];

      const outCanvas = document.createElement("canvas");
      outCanvas.width = preset.width;
      outCanvas.height = preset.height;
      const ctx = outCanvas.getContext("2d")!;

      const stream = outCanvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
        videoBitsPerSecond: 8000000,
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `aman-style-${aspectRatio.replace(":", "x")}-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsExporting(false);
        setExportProgress(100);
      };

      if (mediaType === "video") {
        const video = document.querySelector("video") as HTMLVideoElement;
        if (!video) return;

        video.currentTime = 0;
        await video.play();
        mediaRecorder.start();

        const duration = video.duration;
        const startTime = performance.now();

        const captureFrame = () => {
          if (video.ended || video.paused) {
            mediaRecorder.stop();
            return;
          }

          ctx.drawImage(glCanvas, 0, 0, preset.width, preset.height);
          if (textCanvas) {
            ctx.drawImage(textCanvas, 0, 0, preset.width, preset.height);
          }

          if (showEndCard && video.currentTime > duration - 2) {
            const endFade = Math.min(1, (video.currentTime - (duration - 2)) / 0.5);
            ctx.globalAlpha = endFade * 0.6;
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, preset.width, preset.height);
            ctx.globalAlpha = endFade;
            ctx.fillStyle = "#F5F0EB";
            ctx.font = `200 ${preset.width * 0.04}px "Josefin Sans", sans-serif`;
            ctx.textAlign = "center";
            (ctx as CanvasRenderingContext2D).letterSpacing = `${preset.width * 0.02}px`;
            ctx.fillText("A M A N", preset.width / 2, preset.height / 2);
            ctx.globalAlpha = 1;
          }

          const elapsed = (performance.now() - startTime) / 1000;
          setExportProgress(Math.min(95, (elapsed / duration) * 100));
          requestAnimationFrame(captureFrame);
        };

        captureFrame();
      } else {
        // Image -> Video with Ken Burns
        mediaRecorder.start();
        const duration = photoDuration;
        const startTime = performance.now();

        const captureFrame = () => {
          const elapsed = (performance.now() - startTime) / 1000;

          if (elapsed >= duration) {
            mediaRecorder.stop();
            return;
          }

          ctx.drawImage(glCanvas, 0, 0, preset.width, preset.height);
          if (textCanvas) {
            ctx.drawImage(textCanvas, 0, 0, preset.width, preset.height);
          }

          // End card for photo video
          if (showEndCard && elapsed > duration - 2) {
            const endFade = Math.min(1, (elapsed - (duration - 2)) / 0.5);
            ctx.globalAlpha = endFade * 0.6;
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, preset.width, preset.height);
            ctx.globalAlpha = endFade;
            ctx.fillStyle = "#F5F0EB";
            ctx.font = `200 ${preset.width * 0.04}px "Josefin Sans", sans-serif`;
            ctx.textAlign = "center";
            (ctx as CanvasRenderingContext2D).letterSpacing = `${preset.width * 0.02}px`;
            ctx.fillText("A M A N", preset.width / 2, preset.height / 2);
            ctx.globalAlpha = 1;
          }

          setExportProgress(Math.min(95, (elapsed / duration) * 100));
          requestAnimationFrame(captureFrame);
        };

        captureFrame();
      }
    } catch (err) {
      console.error("Export failed:", err);
      setIsExporting(false);
    }
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
                    ? "bg-aman-gold/20 text-aman-cream border border-aman-gold/30"
                    : "text-aman-stone hover:text-aman-cream hover:bg-white/5 border border-transparent"
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
            Ken Burns Effect
          </h3>
          <div className="grid grid-cols-2 gap-1.5">
            {KB_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setKenBurns(opt.value)}
                className={`px-2 py-1.5 text-[10px] tracking-wider uppercase transition-all duration-300 rounded-sm ${
                  kenBurns === opt.value
                    ? "bg-aman-gold/20 text-aman-cream border border-aman-gold/30"
                    : "text-aman-stone hover:text-aman-cream hover:bg-white/5 border border-transparent"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-aman-stone tracking-wider uppercase">Duration</span>
              <span className="text-aman-sand tabular-nums">{photoDuration}s</span>
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
            showEndCard ? "bg-aman-gold/40" : "bg-white/10"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-aman-cream absolute top-0.5 transition-transform duration-300 ${
              showEndCard ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* Export buttons */}
      <div className="space-y-2">
        {mediaType === "image" && (
          <button
            onClick={handleExportImage}
            disabled={!videoUrl || isExporting}
            className="w-full py-3 text-xs tracking-[0.3em] uppercase font-light border border-aman-gold/30 text-aman-cream hover:bg-aman-gold/10 transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-sm"
          >
            Export as Image
          </button>
        )}

        <button
          onClick={handleExportVideo}
          disabled={!videoUrl || isExporting}
          className="w-full py-3 text-xs tracking-[0.3em] uppercase font-light border border-aman-gold/30 text-aman-cream hover:bg-aman-gold/10 transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-sm"
        >
          {isExporting
            ? "Exporting..."
            : mediaType === "image"
            ? "Export as Video (Ken Burns)"
            : "Export Video"}
        </button>
      </div>

      {/* Progress */}
      {isExporting && (
        <div className="space-y-2">
          <div className="h-px bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-aman-gold/60 transition-all duration-300"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-aman-stone text-center tracking-wider">
            {exportProgress.toFixed(0)}%
          </p>
        </div>
      )}
    </div>
  );
}
