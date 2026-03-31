"use client";

import { useEditorStore, AMAN_PRESETS } from "@/lib/store";

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs">
        <span className="text-aman-stone tracking-wider uppercase">{label}</span>
        <span className="text-aman-gold tabular-nums">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

export default function FilterControls() {
  const { filter, setFilter, activePreset, setPreset, mediaType } = useEditorStore();

  return (
    <div className="space-y-6">
      {/* Preset selector */}
      <div>
        <h3 className="text-xs tracking-[0.3em] uppercase text-aman-stone mb-3">
          Presets
        </h3>
        <div className="grid grid-cols-1 gap-1.5">
          {Object.keys(AMAN_PRESETS).map((name) => (
            <button
              key={name}
              onClick={() => setPreset(name)}
              className={`text-left px-3 py-2 text-xs tracking-wider uppercase transition-all duration-300 rounded-sm ${
                activePreset === name
                  ? "bg-aman-gold/20 text-aman-dark border border-aman-gold/40"
                  : "text-aman-stone hover:text-aman-dark hover:bg-aman-warm-bg border border-transparent"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Manual controls */}
      <div>
        <h3 className="text-xs tracking-[0.3em] uppercase text-aman-stone mb-3">
          Fine Tuning
        </h3>
        <div className="space-y-4">
          <Slider label="Warmth" value={filter.warmth} min={0} max={1} step={0.01} onChange={(v) => setFilter({ warmth: v })} />
          <Slider label="Contrast" value={filter.contrast} min={0.5} max={1.5} step={0.01} onChange={(v) => setFilter({ contrast: v })} />
          <Slider label="Saturation" value={filter.saturation} min={0} max={1.5} step={0.01} onChange={(v) => setFilter({ saturation: v })} />
          <Slider label="Shadow Lift" value={filter.shadowLift} min={0} max={0.3} step={0.01} onChange={(v) => setFilter({ shadowLift: v })} />
          <Slider label="Brightness" value={filter.brightness} min={0.5} max={1.5} step={0.01} onChange={(v) => setFilter({ brightness: v })} />
          <Slider label="Film Grain" value={filter.grain} min={0} max={0.15} step={0.005} onChange={(v) => setFilter({ grain: v })} />
          <Slider label="Vignette" value={filter.vignette} min={0} max={1} step={0.01} onChange={(v) => setFilter({ vignette: v })} />
          {mediaType === "video" && (
            <Slider label="Speed" value={filter.speed} min={0.3} max={1} step={0.05} onChange={(v) => setFilter({ speed: v })} />
          )}
        </div>
      </div>
    </div>
  );
}
