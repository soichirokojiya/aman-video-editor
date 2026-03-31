"use client";

import { useState } from "react";
import { useEditorStore } from "@/lib/store";
import VideoCanvas from "@/components/VideoCanvas";
import FilterControls from "@/components/FilterControls";
import TextPanel from "@/components/TextPanel";
import ExportPanel from "@/components/ExportPanel";
import UploadZone from "@/components/UploadZone";

type Tab = "style" | "text" | "export";

export default function Home() {
  const { videoUrl, reset } = useEditorStore();
  const [activeTab, setActiveTab] = useState<Tab>("style");

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-aman-cream">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-aman-clay/15">
        <div className="flex items-center gap-3">
          <h1 className="text-sm tracking-[0.5em] uppercase font-display font-light text-aman-dark">
            Aman Style
          </h1>
          <span className="text-[10px] tracking-wider text-aman-stone/60 uppercase">
            Video Editor
          </span>
        </div>
        <div className="flex items-center gap-4">
          {videoUrl && (
            <UploadZone />
          )}
          {videoUrl && (
            <button
              onClick={reset}
              className="text-[10px] tracking-wider uppercase text-aman-stone/60 hover:text-red-500/60 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video preview area */}
        <div className="flex-1 flex items-center justify-center p-6 bg-aman-linen">
          {videoUrl ? (
            <VideoCanvas />
          ) : (
            <UploadZone />
          )}
        </div>

        {/* Sidebar */}
        {videoUrl && (
          <aside className="w-72 border-l border-aman-clay/15 flex flex-col overflow-hidden bg-aman-cream">
            {/* Tabs */}
            <div className="flex border-b border-aman-clay/15">
              {(["style", "text", "export"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-[10px] tracking-[0.25em] uppercase transition-all duration-300 ${
                    activeTab === tab
                      ? "text-aman-dark border-b border-aman-gold"
                      : "text-aman-stone/60 hover:text-aman-stone"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "style" && <FilterControls />}
              {activeTab === "text" && <TextPanel />}
              {activeTab === "export" && <ExportPanel />}
            </div>

            {/* Footer info */}
            <div className="px-4 py-3 border-t border-aman-clay/15">
              <p className="text-[9px] text-aman-stone/50 tracking-wider uppercase text-center">
                Warm earth tones — Muted saturation — Meditative pace
              </p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
