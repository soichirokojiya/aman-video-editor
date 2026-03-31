"use client";

import { useEditorStore } from "@/lib/store";

export default function TextPanel() {
  const { textOverlays, addTextOverlay, updateTextOverlay, removeTextOverlay } =
    useEditorStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs tracking-[0.3em] uppercase text-aman-stone">
          Text Overlays
        </h3>
        <button
          onClick={addTextOverlay}
          className="text-xs tracking-wider uppercase text-aman-gold hover:text-aman-cream transition-colors px-2 py-1 border border-aman-gold/20 rounded-sm hover:border-aman-gold/40"
        >
          + Add
        </button>
      </div>

      {textOverlays.length === 0 && (
        <p className="text-xs text-aman-stone/60 italic">
          Aman style favors minimal text. Use sparingly.
        </p>
      )}

      {textOverlays.map((t) => (
        <div
          key={t.id}
          className="border border-aman-clay/15 rounded-sm p-3 space-y-3 bg-aman-linen/50"
        >
          <input
            type="text"
            value={t.text}
            onChange={(e) => updateTextOverlay(t.id, { text: e.target.value })}
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
                    fontFamily: e.target.value as "Cormorant Garamond" | "Josefin Sans",
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
                min={12}
                max={72}
                value={t.fontSize}
                onChange={(e) =>
                  updateTextOverlay(t.id, { fontSize: parseInt(e.target.value) })
                }
                className="w-full mt-2"
              />
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

          <button
            onClick={() => removeTextOverlay(t.id)}
            className="text-[10px] text-red-400/60 hover:text-red-400 uppercase tracking-wider transition-colors"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
