import { useState, useMemo } from "react";
import type { ParkMarker } from "@/lib/nps";
import { LEGEND_ITEMS } from "@/lib/designation-colors";
export { LEGEND_ITEMS };

export type MapMode = "parks" | "campgrounds";

interface Props {
  designationFilter: string | null;
  onDesignationChange: (key: string | null) => void;
  activityFilter: string | null;
  onActivityChange: (key: string | null) => void;
  parkMarkers: ParkMarker[];
  mode?: MapMode;
  onModeChange?: (mode: MapMode) => void;
  campgroundCount?: number;
}

function getAllActivities(markers: ParkMarker[]): string[] {
  const set = new Set<string>();
  for (const m of markers) {
    for (const a of m.activities) set.add(a);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export default function MapLegend({ designationFilter, onDesignationChange, activityFilter, onActivityChange, parkMarkers, mode = "parks", onModeChange, campgroundCount = 0 }: Props) {
  const [megaOpen, setMegaOpen] = useState(false);
  const [designationOpen, setDesignationOpen] = useState(false);
  const allActivities = useMemo(() => getAllActivities(parkMarkers), [parkMarkers]);

  const hasAnyFilter = designationFilter || activityFilter || mode === "campgrounds";

  function selectActivity(name: string) {
    onActivityChange(activityFilter === name ? null : name);
    setMegaOpen(false);
  }

  function handleDesignationClick() {
    if (designationOpen) {
      setDesignationOpen(false);
    } else {
      setDesignationOpen(true);
      setMegaOpen(false);
      onModeChange?.("parks");
    }
  }

  function handleActivityClick() {
    setMegaOpen((o) => !o);
    setDesignationOpen(false);
    onModeChange?.("parks");
  }

  function handleCampgroundClick() {
    if (mode === "campgrounds") {
      onModeChange?.("parks");
    } else {
      onModeChange?.("campgrounds");
      setDesignationOpen(false);
      setMegaOpen(false);
      onDesignationChange(null);
      onActivityChange(null);
    }
  }

  function clearAll() {
    onDesignationChange(null);
    onActivityChange(null);
    onModeChange?.("parks");
    setDesignationOpen(false);
    setMegaOpen(false);
  }

  return (
    <div className="relative">
      {/* Primary filter bar */}
      <div className="w-full bg-[var(--color-bg)]/80 backdrop-blur border-b border-white/5 px-2 lg:px-4 py-1.5 flex items-center justify-center gap-1 lg:gap-2">
        <span className="text-[8px] lg:text-xs text-[var(--color-text-muted)] shrink-0">Click to filter by:</span>

        {/* Park Designation */}
        <button
          onClick={handleDesignationClick}
          className={`shrink-0 text-[8px] lg:text-xs px-2 lg:px-3 py-0.5 lg:py-1 rounded-full transition-all ${
            designationOpen || designationFilter
              ? "bg-white/10 text-[var(--color-text)] font-medium ring-1 ring-white/20"
              : "text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)]"
          }`}
        >
          Park Designation
        </button>

        {/* Activities */}
        <button
          onClick={handleActivityClick}
          className={`shrink-0 text-[8px] lg:text-xs px-2 lg:px-3 py-0.5 lg:py-1 rounded-full transition-all flex items-center gap-1 ${
            megaOpen || activityFilter
              ? "bg-white/10 text-[var(--color-text)] font-medium ring-1 ring-white/20"
              : "text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)]"
          }`}
        >
          Activities
          <svg className="h-2 w-2 lg:h-3 lg:w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={megaOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
          </svg>
        </button>

        {/* Campgrounds */}
        <button
          onClick={handleCampgroundClick}
          className={`shrink-0 text-[8px] lg:text-xs px-2 lg:px-3 py-0.5 lg:py-1 rounded-full transition-all ${
            mode === "campgrounds"
              ? "bg-white/20 text-white font-medium ring-1 ring-white/30"
              : "text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)]"
          }`}
        >
          Campgrounds
        </button>

        {/* Clear — only element that appears/disappears, positioned after the last button so nothing shifts */}
        {hasAnyFilter && (
          <button
            onClick={clearAll}
            className="text-[8px] lg:text-xs text-[var(--color-accent)] hover:underline shrink-0 whitespace-nowrap"
          >
            Clear
          </button>
        )}
      </div>

      {/* Designation pills row */}
      {designationOpen && (
        <div className="w-full bg-[var(--color-bg)]/80 backdrop-blur border-b border-white/5 px-2 lg:px-4 py-1.5 flex items-center justify-center gap-px lg:gap-1 overflow-x-auto scrollbar-hide">
          {LEGEND_ITEMS.map(({ label, color, key }) => {
            const active = designationFilter === key;
            const dimmed = designationFilter !== null && !active;
            return (
              <button
                key={key}
                onClick={() => onDesignationChange(active ? null : key)}
                className={`flex items-center gap-0.5 lg:gap-1.5 shrink-0 px-1.5 lg:px-2.5 py-0.5 lg:py-1 rounded-full transition-all ${
                  active
                    ? "bg-white/10 ring-1 ring-white/20"
                    : dimmed
                      ? "opacity-40 hover:opacity-70"
                      : "hover:bg-white/5"
                }`}
              >
                <span
                  className="h-1.5 w-1.5 lg:h-2.5 lg:w-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[8px] lg:text-xs text-[var(--color-text-muted)] whitespace-nowrap">{label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Mega nav dropdown for activities */}
      {megaOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMegaOpen(false)} />
          <div className="absolute top-full inset-x-0 z-20 bg-[var(--color-bg)]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl max-h-[60vh] overflow-y-auto">
            <div className="max-w-5xl mx-auto px-6 py-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
                {allActivities.map((name) => (
                  <button
                    key={name}
                    onClick={() => selectActivity(name)}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition-all ${
                      activityFilter === name
                        ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                        : "text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)]"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
            <div className="sticky bottom-0 h-10 bg-gradient-to-t from-[var(--color-bg)] to-transparent pointer-events-none" />
          </div>
        </>
      )}
    </div>
  );
}
