import { useState, useMemo } from "react";
import type { ParkMarker } from "@/lib/nps";

const LEGEND_ITEMS = [
  { label: "National Park", plural: "National Parks", color: "#34d399", key: "park" },
  { label: "Monument", plural: "National Monuments", color: "#fbbf24", key: "monument" },
  { label: "Historic", plural: "National Historic Parks", color: "#c084fc", key: "historic" },
  { label: "Memorial / Battlefield", plural: "National Memorials & Battlefields", color: "#fb7185", key: "memorial" },
  { label: "Seashore / River", plural: "National Seashores & Rivers", color: "#22d3ee", key: "water" },
  { label: "Recreation / Preserve", plural: "National Recreation Areas & Preserves", color: "#38bdf8", key: "recreation" },
  { label: "Parkway", plural: "National Parkways", color: "#fb923c", key: "parkway" },
  { label: "Other", plural: "Other Designations", color: "#94a3b8", key: "other" },
];

export { LEGEND_ITEMS };

interface Props {
  designationFilter: string | null;
  onDesignationChange: (key: string | null) => void;
  activityFilter: string | null;
  onActivityChange: (key: string | null) => void;
  parkMarkers: ParkMarker[];
}

function getAllActivities(markers: ParkMarker[]): string[] {
  const set = new Set<string>();
  for (const m of markers) {
    for (const a of m.activities) set.add(a);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export default function MapLegend({ designationFilter, onDesignationChange, activityFilter, onActivityChange, parkMarkers }: Props) {
  const [megaOpen, setMegaOpen] = useState(false);
  const allActivities = useMemo(() => getAllActivities(parkMarkers), [parkMarkers]);

  const hasAnyFilter = designationFilter || activityFilter;

  function selectActivity(name: string) {
    onActivityChange(activityFilter === name ? null : name);
    setMegaOpen(false);
  }

  return (
    <div className="relative">
      {/* Single filter bar */}
      <div className="w-full bg-[var(--color-bg)]/80 backdrop-blur border-b border-white/5 px-1 py-1 flex items-center justify-center gap-px overflow-x-auto scrollbar-hide">
        <span className="text-[7px] lg:text-[10px] font-medium text-[var(--color-text)] shrink-0 mr-px lg:mr-1">Filter by</span>

        {/* Designation filters */}
        {LEGEND_ITEMS.map(({ label, color, key }) => {
          const active = designationFilter === key;
          const dimmed = designationFilter !== null && !active;
          return (
            <button
              key={key}
              onClick={() => onDesignationChange(active ? null : key)}
              className={`flex items-center gap-0.5 lg:gap-1.5 shrink-0 px-1 lg:px-2.5 py-0.5 lg:py-1 rounded-full transition-all ${
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

        {/* Divider */}
        <div className="h-3 w-px bg-white/10 mx-px lg:mx-1 shrink-0" />

        {/* Activities button */}
        <button
          onClick={() => setMegaOpen((o) => !o)}
          className={`flex items-center gap-0.5 lg:gap-1 text-[7px] lg:text-[10px] font-medium shrink-0 px-1 lg:px-2.5 py-0.5 lg:py-1 rounded-full transition-all whitespace-nowrap ${
            activityFilter
              ? "bg-white/10 text-[var(--color-text)]"
              : "text-[var(--color-text)] hover:bg-white/5"
          }`}
        >
          Find an Activity
          <svg className="h-2 w-2 lg:h-3 lg:w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Active activity pill */}
        {activityFilter && !megaOpen && (
          <button
            onClick={() => setMegaOpen(true)}
            className="shrink-0 px-1 lg:px-2.5 py-0.5 lg:py-1 rounded-full text-[8px] lg:text-xs bg-[var(--color-accent)]/20 text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30 whitespace-nowrap"
          >
            {activityFilter}
          </button>
        )}

        {/* Clear all */}
        {hasAnyFilter && (
          <button
            onClick={() => { onDesignationChange(null); onActivityChange(null); setMegaOpen(false); }}
            className="text-[7px] lg:text-[10px] text-[var(--color-accent)] hover:underline shrink-0 ml-px lg:ml-1 whitespace-nowrap"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter summary */}
      {hasAnyFilter && !megaOpen && (
        <div className="w-full text-center py-2 px-4">
          <p className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg)]/80 backdrop-blur inline-block px-3 py-1.5 rounded-full">
            {designationFilter && activityFilter
              ? <>Showing all parks with &ldquo;{activityFilter}&rdquo; in all {LEGEND_ITEMS.find((d) => d.key === designationFilter)?.plural}</>
              : designationFilter
                ? <>Showing all {LEGEND_ITEMS.find((d) => d.key === designationFilter)?.plural}</>
                : <>Showing all parks with &ldquo;{activityFilter}&rdquo;</>
            }
          </p>
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
            {/* Scroll fade hint */}
            <div className="sticky bottom-0 h-10 bg-gradient-to-t from-[var(--color-bg)] to-transparent pointer-events-none" />
          </div>
        </>
      )}
    </div>
  );
}
