"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import USMap from "@/components/USMap";
import MapLegend, { type MapMode, LEGEND_ITEMS } from "@/components/MapLegend";
import { getDesignationGroup } from "@/lib/designation-colors";
import type { ParkMarker, CampgroundMarker } from "@/lib/nps";

interface Props {
  parkMarkers: ParkMarker[];
  campgroundMarkers?: CampgroundMarker[];
}

export default function HomeMap({ parkMarkers, campgroundMarkers = [] }: Props) {
  const searchParams = useSearchParams();
  const initialActivity = searchParams.get("activity");
  const [designationFilter, setDesignationFilter] = useState<string | null>(null);
  const [activityFilter, setActivityFilter] = useState<string | null>(initialActivity);
  const [mode, setMode] = useState<MapMode>("parks");

  const filtered = useMemo(() => {
    return parkMarkers.filter((p) => {
      if (designationFilter && getDesignationGroup(p.designation) !== designationFilter) return false;
      if (activityFilter && !p.activities.includes(activityFilter)) return false;
      return true;
    });
  }, [parkMarkers, designationFilter, activityFilter]);

  function handleModeChange(newMode: MapMode) {
    setMode(newMode);
    if (newMode === "campgrounds") {
      setDesignationFilter(null);
      setActivityFilter(null);
    }
  }

  return (
    <>
      <div className="w-full h-full">
        <USMap
          parkMarkers={mode === "parks" ? filtered : []}
          campgroundMarkers={mode === "campgrounds" ? campgroundMarkers : []}
          mode={mode}
        />
      </div>

      <div className="absolute top-0 inset-x-0 z-10">
        <MapLegend
          designationFilter={designationFilter}
          onDesignationChange={setDesignationFilter}
          activityFilter={activityFilter}
          onActivityChange={setActivityFilter}
          parkMarkers={parkMarkers}
          mode={mode}
          onModeChange={handleModeChange}
          campgroundCount={campgroundMarkers.length}
        />
      </div>

      <div className="absolute bottom-6 inset-x-0 text-center z-10">
        <div className="inline-block bg-[var(--color-bg)]/80 backdrop-blur px-4 py-2 rounded-full">
          <p className="text-sm text-[var(--color-text-muted)]">
            {mode === "campgrounds" ? (
              <>Showing all Campgrounds</>
            ) : designationFilter && activityFilter ? (
              <>Showing all {LEGEND_ITEMS.find((d) => d.key === designationFilter)?.plural} with &ldquo;{activityFilter}&rdquo;</>
            ) : designationFilter ? (
              <>Showing all {LEGEND_ITEMS.find((d) => d.key === designationFilter)?.plural}</>
            ) : activityFilter ? (
              <>Showing all parks with &ldquo;{activityFilter}&rdquo;</>
            ) : (
              <>Click a state to explore</>
            )}
          </p>
          {designationFilter && !activityFilter && (
            <p className="text-[10px] italic text-[var(--color-text-muted)]/60 mt-0.5">
              Looking for an activity? You can add an activities filter too!
            </p>
          )}
        </div>
      </div>
    </>
  );
}
