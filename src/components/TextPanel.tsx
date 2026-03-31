"use client";

import { useState } from "react";
import { useEditorStore, useActiveSlide, TEXT_TEMPLATES } from "@/lib/store";

export default function TextPanel() {
  const slide = useActiveSlide();
  const {
    addTextOverlay,
    updateTextOverlay,
    removeTextOverlay,
    applyTextTemplate,
  } = useEditorStore();
  const textOverlays = slide?.textOverlays ?? [];
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  const handleApplyTemplate = (name: string) => {
    const template = TEXT_TEMPLATES.find((t) => t.name === name);
    if (template) {
      applyTextTemplate(template);
      setActiveTemplate(name);
    }
  };

  return (
    <div className="space-y-5">
      {/* Template presets */}
      <div>
        <h3 className="text-xs tracking-[0.3em] uppercase text-aman-stone mb-3">
          Templates
        </h3>
        <div className="grid grid-cols-1 gap-1">
          {TEXT_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.name}
              onClick={() => handleApplyTemplate(tmpl.name)}
              className={`text-left px-3 py-2 rounded-sm transition-all duration-300 ${
                activeTemplate === tmpl.name
                  ? "bg-aman-gold/20 border border-aman-gold/40"
                  : "hover:bg-aman-warm-bg border border-transparent"
              }`}
            >
              <span
                className={`text-xs tracking-wider uppercase block ${
                  activeTemplate === tmpl.name
                    ? "text-aman-dark"
                    : "text-aman-stone"
                }`}
              >
                {tmpl.name}
              </span>
              <span className="text-[9px] text-aman-clay tracking-wider">
                {tmpl.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      {textOverlays.length > 0 && (
        <div className="border-t border-aman-clay/15" />
      )}

      {/* Editable text layers */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs tracking-[0.3em] uppercase text-aman-stone">
            Text Layers
          </h3>
          <button
            onClick={addTextOverlay}
            className="text-xs tracking-wider uppercase text-aman-gold hover:text-aman-dark transition-colors px-2 py-1 border border-aman-gold/20 rounded-sm hover:border-aman-gold/40"
          >
            + Add
          </button>
        </div>

        {textOverlays.length === 0 && (
          <p className="text-xs text-aman-stone/50 italic">
            Select a template above or add a custom layer.
          </p>
        )}

        {textOverlays.map((t, i) => (
          <div
            key={t.id}
            className="border border-aman-clay/15 rounded-sm p-3 space-y-3 bg-aman-linen/50 mb-2"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-aman-clay tracking-wider uppercase">
                Layer {i + 1}
              </span>
              <button
                onClick={() => removeTextOverlay(t.id)}
                className="text-[9px] text-red-400/60 hover:text-red-500 uppercase tracking-wider transition-colors"
              >
                Remove
              </button>
            </div>

            <input
              type="text"
              value={t.text}
              onChange={(e) =>
                updateTextOverlay(t.id, { text: e.target.value })
              }
              className="w-full bg-transparent border-b border-aman-stone/20 text-aman-dark text-sm px-0 py-1 focus:outline-none focus:border-aman-gold/50 tracking-wider uppercase"
              placeholder="Text..."
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-aman-stone/60 uppercase tracking-wider">
                  Font
                </label>
                <select
                  value={t.fontFamily}
                  onChange={(e) =>
                    updateTextOverlay(t.id, {
                      fontFamily: e.target.value as
                        | "Cormorant Garamond"
                        | "Josefin Sans",
                    })
                  }
                  className="w-full bg-transparent border border-aman-clay/20 text-aman-dark text-xs p-1.5 rounded-sm mt-1"
                >
                  <option value="Josefin Sans">Josefin Sans</option>
                  <option value="Cormorant Garamond">Cormorant Garamond</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-aman-stone/60 uppercase tracking-wider">
                  Size
                </label>
                <input
                  type="range"
                  min={8}
                  max={72}
                  value={t.fontSize}
                  onChange={(e) =>
                    updateTextOverlay(t.id, {
                      fontSize: parseInt(e.target.value),
                    })
                  }
                  className="w-full mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-aman-stone/60 uppercase tracking-wider">
                  Weight
                </label>
                <select
                  value={t.fontWeight}
                  onChange={(e) =>
                    updateTextOverlay(t.id, {
                      fontWeight: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-transparent border border-aman-clay/20 text-aman-dark text-xs p-1.5 rounded-sm mt-1"
                >
                  <option value={200}>Extra Light</option>
                  <option value={300}>Light</option>
                  <option value={400}>Regular</option>
                  <option value={500}>Medium</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-aman-stone/60 uppercase tracking-wider">
                  Color
                </label>
                <div className="flex gap-1 mt-1">
                  {["#F5F0EB", "#1A1815", "#C4A882", "#B8956A", "#8A8075"].map(
                    (c) => (
                      <button
                        key={c}
                        onClick={() =>
                          updateTextOverlay(t.id, { color: c })
                        }
                        className={`w-6 h-6 rounded-sm border transition-all ${
                          t.color === c
                            ? "border-aman-gold scale-110"
                            : "border-aman-clay/20 hover:border-aman-clay/40"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-aman-stone/60 uppercase tracking-wider">
                  Position X
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={t.x}
                  onChange={(e) =>
                    updateTextOverlay(t.id, { x: parseInt(e.target.value) })
                  }
                  className="w-full mt-2"
                />
              </div>
              <div>
                <label className="text-[10px] text-aman-stone/60 uppercase tracking-wider">
                  Position Y
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={t.y}
                  onChange={(e) =>
                    updateTextOverlay(t.id, { y: parseInt(e.target.value) })
                  }
                  className="w-full mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-aman-stone/60 uppercase tracking-wider">
                  Letter Spacing
                </label>
                <input
                  type="range"
                  min={0}
                  max={30}
                  value={t.letterSpacing}
                  onChange={(e) =>
                    updateTextOverlay(t.id, {
                      letterSpacing: parseInt(e.target.value),
                    })
                  }
                  className="w-full mt-2"
                />
              </div>
              <div>
                <label className="text-[10px] text-aman-stone/60 uppercase tracking-wider">
                  Opacity
                </label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={t.opacity}
                  onChange={(e) =>
                    updateTextOverlay(t.id, {
                      opacity: parseFloat(e.target.value),
                    })
                  }
                  className="w-full mt-2"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
