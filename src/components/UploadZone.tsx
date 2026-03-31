"use client";

import { useCallback, useState } from "react";
import { useEditorStore } from "@/lib/store";
import { isPanorama } from "@/lib/panorama";
import PanoramaSplitter from "./PanoramaSplitter";

export default function UploadZone() {
  const { slides, addSlide } = useEditorStore();
  const [panoramaFile, setPanoramaFile] = useState<File | null>(null);

  const processFile = useCallback(
    (file: File) => {
      if (file.type.startsWith("image/")) {
        // Check if panorama
        const img = new Image();
        img.onload = () => {
          if (isPanorama(img.naturalWidth, img.naturalHeight)) {
            setPanoramaFile(file);
          } else {
            addSlide(file);
          }
          URL.revokeObjectURL(img.src);
        };
        img.src = URL.createObjectURL(file);
      } else if (file.type.startsWith("video/")) {
        addSlide(file);
      }
    },
    [addSlide]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      for (const file of Array.from(e.dataTransfer.files)) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      for (const file of Array.from(files)) {
        processFile(file);
      }
      e.target.value = "";
    },
    [processFile]
  );

  const hasSlides = slides.length > 0;

  return (
    <>
      {panoramaFile && (
        <PanoramaSplitter
          file={panoramaFile}
          onDone={() => setPanoramaFile(null)}
          onSkip={() => {
            addSlide(panoramaFile);
            setPanoramaFile(null);
          }}
        />
      )}

      {hasSlides ? (
        <label className="cursor-pointer text-[10px] tracking-wider uppercase text-aman-stone hover:text-aman-dark transition-colors">
          Add Files
          <input
            type="file"
            accept="video/*,image/*"
            multiple
            className="hidden"
            onChange={handleChange}
          />
        </label>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex-1 flex flex-col items-center justify-center border border-dashed border-aman-clay/25 rounded-sm hover:border-aman-gold/50 transition-colors duration-500 cursor-pointer p-8"
        >
          <label className="cursor-pointer flex flex-col items-center gap-4">
            <div className="w-20 h-20 border border-aman-clay/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-aman-stone/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={0.75}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm tracking-[0.3em] uppercase font-light text-aman-dark/80">
                Drop your files here
              </p>
              <p className="text-[10px] tracking-wider text-aman-stone/60 mt-2 uppercase">
                Videos & Photos — Multiple files supported
              </p>
              <p className="text-[10px] tracking-wider text-aman-gold/60 mt-1 uppercase">
                Panoramic images auto-detected for carousel split
              </p>
            </div>
            <input
              type="file"
              accept="video/*,image/*"
              multiple
              className="hidden"
              onChange={handleChange}
            />
          </label>
        </div>
      )}
    </>
  );
}
