"use client";

import { useState, useMemo } from "react";
import USMap from "@/components/USMap";
import MapLegend from "@/components/MapLegend";
import { getDesignationGroup } from "@/lib/designation-colors";
import type { ParkMarker } from "@/lib/nps";

interface Props {
  parkMarkers: ParkMarker[];
}

export default function HomeMap({ parkMarkers }: Props) {
  const [designationFilter, setDesignationFilter] = useState<string | null>(null);
  const [activityFilter, setActivityFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return parkMarkers.filter((p) => {
      if (designationFilter && getDesignationGroup(p.designation) !== designationFilter) return false;
      if (activityFilter && !p.activities.includes(activityFilter)) return false;
      return true;
    });
  }, [parkMarkers, designationFilter, activityFilter]);

  return (
    <>
      <div className="w-full h-full">
        <USMap parkMarkers={filtered} />
      </div>

      <div className="absolute top-0 inset-x-0 z-10">
        <MapLegend
          designationFilter={designationFilter}
          onDesignationChange={setDesignationFilter}
          activityFilter={activityFilter}
          onActivityChange={setActivityFilter}
          parkMarkers={parkMarkers}
        />
      </div>

      <div className="absolute bottom-6 inset-x-0 text-center z-10">
        <p className="text-sm text-[var(--color-text-muted)] bg-[var(--color-bg)]/80 backdrop-blur inline-block px-4 py-2 rounded-full">
          Click a state to explore
        </p>
      </div>
    </>
  );
}
