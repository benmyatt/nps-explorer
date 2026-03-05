"use client";

import { useState, useMemo, useEffect } from "react";
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
  const [showPinchHint, setShowPinchHint] = useState(false);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice && !localStorage.getItem("pinchHintDismissed")) {
      setShowPinchHint(true);
    }
  }, []);

  useEffect(() => {
    if (!showPinchHint) return;
    function handleTouch(e: TouchEvent) {
      if (e.touches.length >= 2) {
        setShowPinchHint(false);
        localStorage.setItem("pinchHintDismissed", "1");
      }
    }
    window.addEventListener("touchmove", handleTouch);
    return () => window.removeEventListener("touchmove", handleTouch);
  }, [showPinchHint]);

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

      <div className="absolute bottom-4 inset-x-0 z-10 flex flex-col items-center gap-2">
        {showPinchHint && (
          <div className="animate-pulse">
            <div className="inline-flex items-center gap-2 bg-[var(--color-bg)]/90 backdrop-blur px-4 py-2 rounded-full">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
                <path d="M6 12L6 4M18 12L18 4M6 12C6 12 2 14 2 17M18 12C18 12 22 14 22 17M9 1L9 3M15 1L15 3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs text-white/60">Pinch to zoom</span>
            </div>
          </div>
        )}

        <div className="inline-block bg-[var(--color-bg)]/80 backdrop-blur px-4 py-2 rounded-full">
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
            {mode === "campgrounds" ? (
              <>Showing all Campgrounds</>
            ) : designationFilter && activityFilter ? (
              <>Showing all {LEGEND_ITEMS.find((d) => d.key === designationFilter)?.plural} with &ldquo;{activityFilter}&rdquo;</>
            ) : designationFilter ? (
              <>Showing all {LEGEND_ITEMS.find((d) => d.key === designationFilter)?.plural}</>
            ) : activityFilter ? (
              <>Showing all parks with &ldquo;{activityFilter}&rdquo;</>
            ) : (
              <>Tap a state to explore</>
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
