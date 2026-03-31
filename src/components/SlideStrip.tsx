"use client";

import { useRef, useCallback } from "react";
import { useEditorStore } from "@/lib/store";

export default function SlideStrip() {
  const {
    slides, activeSlideIndex, setActiveSlide, removeSlide,
    addSlide, reorderSlides,
  } = useEditorStore();
  const dragFrom = useRef<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDragStart = (index: number) => {
    dragFrom.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragFrom.current !== null && dragFrom.current !== index) {
      reorderSlides(dragFrom.current, index);
      dragFrom.current = index;
    }
  };

  const handleDragEnd = () => {
    dragFrom.current = null;
  };

  const handleAddFiles = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      for (const file of Array.from(files)) {
        if (file.type.startsWith("video/") || file.type.startsWith("image/")) {
          addSlide(file);
        }
      }
      e.target.value = "";
    },
    [addSlide]
  );

  if (slides.length === 0) return null;

  return (
    <div className="border-t border-aman-clay/15 bg-aman-cream px-4 py-3">
      <div className="flex items-center gap-2 overflow-x-auto">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragEnd={handleDragEnd}
            onClick={() => setActiveSlide(i)}
            className={`relative flex-shrink-0 w-14 h-20 rounded-sm overflow-hidden cursor-pointer transition-all duration-200 group ${
              activeSlideIndex === i
                ? "ring-2 ring-aman-gold scale-105"
                : "ring-1 ring-aman-clay/20 hover:ring-aman-clay/40 opacity-70 hover:opacity-100"
            }`}
          >
            {/* Thumbnail */}
            {slide.thumbnailUrl ? (
              <img
                src={slide.thumbnailUrl}
                alt={`Slide ${i + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-aman-warm-bg flex items-center justify-center">
                <span className="text-[9px] text-aman-stone uppercase">
                  {slide.mediaType === "video" ? "VID" : "IMG"}
                </span>
              </div>
            )}

            {/* Slide number */}
            <div className="absolute top-0.5 left-0.5 bg-black/40 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-sm">
              {i + 1}
            </div>

            {/* Media type icon */}
            {slide.mediaType === "video" && (
              <div className="absolute bottom-0.5 right-0.5 bg-black/40 rounded-sm p-0.5">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}

            {/* Remove button */}
            {slides.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSlide(i);
                }}
                className="absolute top-0.5 right-0.5 bg-black/40 text-white/70 hover:text-red-400 text-[8px] w-4 h-4 items-center justify-center rounded-sm hidden group-hover:flex transition-colors"
              >
                x
              </button>
            )}
          </div>
        ))}

        {/* Add slide button */}
        <button
          onClick={() => fileRef.current?.click()}
          className="flex-shrink-0 w-14 h-20 rounded-sm border border-dashed border-aman-clay/25 hover:border-aman-gold/50 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 text-aman-stone/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="video/*,image/*"
          multiple
          className="hidden"
          onChange={handleAddFiles}
        />
      </div>

      <p className="text-[9px] text-aman-stone/40 tracking-wider uppercase mt-2 text-center">
        {slides.length} slide{slides.length > 1 ? "s" : ""} — Drag to reorder
      </p>
    </div>
  );
}
