"use client";

import { useState, useMemo } from "react";
import {
  CAPTION_TEMPLATES,
  AMAN_PROPERTIES,
  SEASONS,
  formatCaption,
} from "@/lib/caption-templates";

type LangMode = "bilingual" | "en" | "ja";

export default function CaptionPanel() {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [property, setProperty] = useState("Aman Tokyo");
  const [location, setLocation] = useState("Tokyo");
  const [season, setSeason] = useState("Spring");
  const [langMode, setLangMode] = useState<LangMode>("bilingual");
  const [copied, setCopied] = useState(false);

  const template = CAPTION_TEMPLATES[selectedTemplate];

  const vars = useMemo(
    () => ({ property, location, season }),
    [property, location, season]
  );

  const caption = useMemo(
    () => formatCaption(template, vars, langMode),
    [template, vars, langMode]
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Template selector */}
      <div>
        <h3 className="text-xs tracking-[0.3em] uppercase text-aman-stone mb-3">
          Caption Template
        </h3>
        <div className="grid grid-cols-1 gap-1">
          {CAPTION_TEMPLATES.map((tmpl, i) => (
            <button
              key={tmpl.name}
              onClick={() => setSelectedTemplate(i)}
              className={`text-left px-3 py-2 rounded-sm transition-all duration-300 ${
                selectedTemplate === i
                  ? "bg-aman-gold/20 text-aman-dark border border-aman-gold/40"
                  : "text-aman-stone hover:text-aman-dark hover:bg-aman-warm-bg border border-transparent"
              }`}
            >
              <span className="text-xs tracking-wider uppercase">{tmpl.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Variables */}
      <div>
        <h3 className="text-xs tracking-[0.3em] uppercase text-aman-stone mb-3">
          Details
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-aman-stone/60 uppercase tracking-wider">
              Property
            </label>
            <select
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              className="w-full bg-transparent border border-aman-clay/20 text-aman-dark text-xs p-1.5 rounded-sm mt-1"
            >
              {AMAN_PROPERTIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-aman-stone/60 uppercase tracking-wider">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent border border-aman-clay/20 text-aman-dark text-xs p-1.5 rounded-sm mt-1"
            />
          </div>
          <div>
            <label className="text-[10px] text-aman-stone/60 uppercase tracking-wider">
              Season
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full bg-transparent border border-aman-clay/20 text-aman-dark text-xs p-1.5 rounded-sm mt-1"
            >
              {SEASONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Language mode */}
      <div>
        <h3 className="text-xs tracking-[0.3em] uppercase text-aman-stone mb-3">
          Language
        </h3>
        <div className="flex gap-1.5">
          {(
            [
              { value: "bilingual", label: "EN + JA" },
              { value: "en", label: "English" },
              { value: "ja", label: "Japanese" },
            ] as { value: LangMode; label: string }[]
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setLangMode(opt.value)}
              className={`flex-1 py-1.5 text-[10px] tracking-wider uppercase rounded-sm transition-all ${
                langMode === opt.value
                  ? "bg-aman-gold/20 text-aman-dark border border-aman-gold/40"
                  : "text-aman-stone border border-aman-clay/20 hover:border-aman-clay/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div>
        <h3 className="text-xs tracking-[0.3em] uppercase text-aman-stone mb-3">
          Preview
        </h3>
        <div className="bg-aman-linen/70 border border-aman-clay/15 rounded-sm p-3 text-xs text-aman-dark leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
          {caption}
        </div>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className={`w-full py-3 text-xs tracking-[0.3em] uppercase font-light border rounded-sm transition-all duration-500 ${
          copied
            ? "bg-aman-gold/30 border-aman-gold/50 text-aman-dark"
            : "border-aman-gold/40 text-aman-dark hover:bg-aman-gold/15"
        }`}
      >
        {copied ? "Copied!" : "Copy Caption"}
      </button>
    </div>
  );
}
