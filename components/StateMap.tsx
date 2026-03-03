"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { geoCentroid, geoMercator, geoBounds } from "d3-geo";
import { feature } from "topojson-client";
import { useRouter } from "next/navigation";
import { FIPS_TO_STATE } from "@/lib/states";
import { getDesignationHex } from "@/lib/designation-colors";
import type { ParkMarker } from "@/lib/nps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface Props {
  stateCode: string;
  parkMarkers: ParkMarker[];
}

// Reverse lookup: state code -> FIPS
const STATE_TO_FIPS: Record<string, string> = {};
Object.entries(FIPS_TO_STATE).forEach(([fips, code]) => {
  STATE_TO_FIPS[code] = fips;
});

export default function StateMap({ stateCode, parkMarkers }: Props) {
  const router = useRouter();
  const [tooltip, setTooltip] = useState<{
    content: string;
    x: number;
    y: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stateGeo, setStateGeo] = useState<any>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    parkMarkers.forEach((p) => router.prefetch(`/park/${p.parkCode}`));
  }, [router, parkMarkers]);

  // Fetch TopoJSON and extract state feature for bounds calculation
  useEffect(() => {
    fetch(GEO_URL)
      .then((res) => res.json())
      .then((topo) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const geo = feature(topo, topo.objects.states) as any;
        const fips = STATE_TO_FIPS[stateCode];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const stateFeature = geo.features.find((f: any) => f.id === fips);
        if (stateFeature) setStateGeo(stateFeature);
      });
  }, [stateCode]);

  const { center, scale } = useMemo(() => {
    if (!stateGeo) {
      return { center: [-98.5, 39.8] as [number, number], scale: 800 };
    }

    const centroid = geoCentroid(stateGeo) as [number, number];
    const bounds = geoBounds(stateGeo);
    const [[x0, y0], [x1, y1]] = bounds;

    const lngSpan = x1 - x0;
    const latSpan = y1 - y0;

    // Compute scale to fit state in 800x600 viewbox with padding
    const padding = 1.6; // leave some room around the state
    const scaleByLng = 800 / ((lngSpan * Math.PI) / 180) / padding;
    const scaleByLat = 600 / ((latSpan * Math.PI) / 180) / padding;
    const computedScale = Math.min(scaleByLng, scaleByLat);

    return {
      center: centroid,
      scale: Math.min(Math.max(computedScale, 800), 80000),
    };
  }, [stateGeo]);

  const projection = useMemo(
    () => geoMercator().center(center).scale(scale).translate([400, 300]),
    [center, scale]
  );

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
    [parkMarkers, mounted, projection]
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

  return (
    <div className="relative w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center, scale }}
        className="w-full h-full"
      >
        <Geographies geography={GEO_URL}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {({ geographies }: any) =>
            geographies.map((geo: any) => {
              const code = FIPS_TO_STATE[geo.id];
              const isActive = code === stateCode;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: isActive ? "#1a2620" : "#0d1410",
                      stroke: isActive ? "#22c55e44" : "#22c55e11",
                      strokeWidth: isActive ? 1 : 0.3,
                      outline: "none",
                    },
                    hover: {
                      fill: isActive ? "#1a2620" : "#0d1410",
                      stroke: isActive ? "#22c55e44" : "#22c55e11",
                      strokeWidth: isActive ? 1 : 0.3,
                      outline: "none",
                    },
                    pressed: {
                      fill: isActive ? "#1a2620" : "#0d1410",
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
                  r={6}
                  fill={color}
                  opacity={0.2}
                  className="park-dot-pulse"
                />
                <circle
                  r={4}
                  fill={color}
                  stroke="#0a0f0d"
                  strokeWidth={1}
                  className="transition-all duration-200 hover:scale-[1.5]"
                  style={{ filter: `drop-shadow(0 0 4px ${color}66)` }}
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
