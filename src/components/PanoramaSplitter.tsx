"use client";

import { useState, useEffect, useRef } from "react";
import { useEditorStore } from "@/lib/store";
import { isPanorama, splitImage } from "@/lib/panorama";

interface Props {
  file: File;
  onDone: () => void;
  onSkip: () => void;
}

export default function PanoramaSplitter({ file, onDone, onSkip }: Props) {
  const { splitPanorama } = useEditorStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sliceCount, setSliceCount] = useState<2 | 3>(2);
  const [splitting, setSplitting] = useState(false);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    const img = new Image();
    img.onload = () => setDimensions({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Draw split preview lines
  useEffect(() => {
    if (!previewUrl || !canvasRef.current || !dimensions.w) return;
    const canvas = canvasRef.current;
    const img = new Image();
    img.onload = () => {
      const maxW = 600;
      const scale = Math.min(maxW / img.naturalWidth, 1);
      canvas.width = img.naturalWidth * scale;
      canvas.height = img.naturalHeight * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw split lines
      ctx.strokeStyle = "rgba(184, 149, 106, 0.8)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      for (let i = 1; i < sliceCount; i++) {
        const x = (canvas.width / sliceCount) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Slice numbers
      ctx.setLineDash([]);
      ctx.font = "bold 16px Josefin Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < sliceCount; i++) {
        const cx = (canvas.width / sliceCount) * (i + 0.5);
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.beginPath();
        ctx.arc(cx, canvas.height / 2, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#F5F0EB";
        ctx.fillText(`${i + 1}`, cx, canvas.height / 2);
      }
    };
    img.src = previewUrl;
  }, [previewUrl, sliceCount, dimensions]);

  const handleSplit = async () => {
    setSplitting(true);
    const blobs = await splitImage(file, sliceCount);
    splitPanorama(file, sliceCount, blobs);
    setSplitting(false);
    onDone();
  };

  if (!isPanorama(dimensions.w, dimensions.h) && dimensions.w > 0) {
    // Not a panorama, skip automatically
    onSkip();
    return null;
  }

  if (!dimensions.w) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-aman-cream rounded-sm p-6 max-w-[650px] w-full space-y-4 shadow-xl">
        <h2 className="text-sm tracking-[0.3em] uppercase text-aman-dark font-display font-light">
          Panorama Detected
        </h2>
        <p className="text-xs text-aman-stone">
          This image is wide enough to split into a carousel. Each slice becomes a separate slide that connects when swiped.
        </p>

        {/* Preview */}
        <canvas ref={canvasRef} className="w-full rounded-sm" />

        {/* Slice count selector */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-aman-stone tracking-wider uppercase">Split into</span>
          {([2, 3] as const).map((n) => (
            <button
              key={n}
              onClick={() => setSliceCount(n)}
              className={`px-4 py-1.5 text-xs tracking-wider uppercase rounded-sm transition-all ${
                sliceCount === n
                  ? "bg-aman-gold/20 text-aman-dark border border-aman-gold/40"
                  : "text-aman-stone border border-aman-clay/20 hover:border-aman-clay/40"
              }`}
            >
              {n} slides
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-xs tracking-wider uppercase text-aman-stone hover:text-aman-dark transition-colors"
          >
            Use as single image
          </button>
          <button
            onClick={handleSplit}
            disabled={splitting}
            className="px-6 py-2 text-xs tracking-wider uppercase bg-aman-gold/20 text-aman-dark border border-aman-gold/40 hover:bg-aman-gold/30 transition-all rounded-sm disabled:opacity-50"
          >
            {splitting ? "Splitting..." : "Split & Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
