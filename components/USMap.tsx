"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { geoAlbersUsa } from "d3-geo";
import { useRouter } from "next/navigation";
import { FIPS_TO_STATE } from "@/lib/states";
import { getDesignationHex } from "@/lib/designation-colors";
import type { ParkMarker } from "@/lib/nps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Must match ComposableMap projectionConfig
const projection = geoAlbersUsa().scale(1000).translate([400, 300]);

interface Props {
  parkMarkers: ParkMarker[];
}

export default function USMap({ parkMarkers }: Props) {
  const router = useRouter();
  const [tooltip, setTooltip] = useState<{
    content: string;
    x: number;
    y: number;
  } | null>(null);

  // Eagerly prefetch all state + park routes on mount
  useEffect(() => {
    const stateCodes = new Set(Object.values(FIPS_TO_STATE));
    stateCodes.forEach((code) => router.prefetch(`/state/${code}`));
    parkMarkers.forEach((p) => router.prefetch(`/park/${p.parkCode}`));
  }, [router, parkMarkers]);

  const handleStateClick = useCallback(
    (geo: { id: string }) => {
      const stateCode = FIPS_TO_STATE[geo.id];
      if (stateCode) {
        router.push(`/state/${stateCode}`);
      }
    },
    [router]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, content: string) => {
      setTooltip({ content, x: e.clientX + 12, y: e.clientY - 28 });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const projectedMarkers = useMemo(
    () =>
      mounted
        ? (parkMarkers
            .map((park) => {
              const coords = projection([park.lng, park.lat]);
              if (!coords) return null;
              return { ...park, x: coords[0], y: coords[1] };
            })
            .filter(Boolean) as (ParkMarker & { x: number; y: number })[])
        : [],
    [parkMarkers, mounted]
  );

  return (
    <div className="relative w-full h-full">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 1000 }}
        className="w-full h-full"
      >
        <Geographies geography={GEO_URL}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {({ geographies }: { geographies: any[] }) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            geographies.map((geo: any) => {
              const stateCode = FIPS_TO_STATE[geo.id];
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleStateClick(geo)}
                  onMouseMove={(e: React.MouseEvent) => {
                    const name =
                      geo.properties.name || stateCode || "Unknown";
                    handleMouseMove(e, name);
                  }}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    default: {
                      fill: "#1a2620",
                      stroke: "#22c55e33",
                      strokeWidth: 0.5,
                      outline: "none",
                      cursor: "pointer",
                    },
                    hover: {
                      fill: "#166534",
                      stroke: "#22c55e",
                      strokeWidth: 1,
                      outline: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    },
                    pressed: {
                      fill: "#15803d",
                      stroke: "#22c55e",
                      strokeWidth: 1,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>

        <g>
          {projectedMarkers.map((park) => {
            const color = getDesignationHex(park.designation);
            return (
              <g
                key={park.parkCode}
                transform={`translate(${park.x}, ${park.y})`}
                onClick={() => router.push(`/park/${park.parkCode}`)}
                onMouseMove={(e) => handleMouseMove(e, park.name)}
                onMouseLeave={handleMouseLeave}
                className="cursor-pointer"
              >
                <circle
                  r={2}
                  fill={color}
                  opacity={0.3}
                  className="park-dot-pulse"
                />
                <circle
                  r={2}
                  fill={color}
                  stroke="#0a0f0d"
                  strokeWidth={0.5}
                  className="transition-transform duration-200 hover:scale-[2]"
                />
              </g>
            );
          })}
        </g>
      </ComposableMap>

      {tooltip && (
        <div
          className="map-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}
