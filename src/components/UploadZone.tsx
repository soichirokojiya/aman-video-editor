"use client";

import { useCallback } from "react";
import { useEditorStore } from "@/lib/store";

export default function UploadZone() {
  const { setMediaFile, videoUrl } = useEditorStore();

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && (file.type.startsWith("video/") || file.type.startsWith("image/"))) {
        setMediaFile(file);
      }
    },
    [setMediaFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) setMediaFile(file);
    },
    [setMediaFile]
  );

  if (videoUrl) {
    return (
      <label className="cursor-pointer text-[10px] tracking-wider uppercase text-aman-stone hover:text-aman-gold transition-colors">
        Change File
        <input
          type="file"
          accept="video/*,image/*"
          className="hidden"
          onChange={handleChange}
        />
      </label>
    );
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="flex-1 flex flex-col items-center justify-center border border-dashed border-aman-stone/20 rounded-sm hover:border-aman-gold/30 transition-colors duration-500 cursor-pointer p-8"
    >
      <label className="cursor-pointer flex flex-col items-center gap-4">
        <div className="w-20 h-20 border border-aman-stone/20 rounded-full flex items-center justify-center">
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
          <p className="text-sm tracking-[0.3em] uppercase font-light text-aman-cream/80">
            Drop your file here
          </p>
          <p className="text-[10px] tracking-wider text-aman-stone/50 mt-2 uppercase">
            Video or Photo — Click to browse
          </p>
        </div>
        <input
          type="file"
          accept="video/*,image/*"
          className="hidden"
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
