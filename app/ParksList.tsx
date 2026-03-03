"use client";

import { useState } from "react";
import Link from "next/link";
import { getDesignationColors } from "@/lib/designation-colors";

interface ParkItem {
  parkCode: string;
  fullName: string;
  designation: string;
  imageUrl: string | null;
}

export default function ParksList({ parks }: { parks: ParkItem[] }) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? parks.filter((p) =>
        p.fullName.toLowerCase().includes(search.toLowerCase()) ||
        p.designation.toLowerCase().includes(search.toLowerCase())
      )
    : parks;

  return (
    <div className="flex flex-col h-full">
      <input
        type="text"
        placeholder="Search parks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)]/30 shrink-0"
      />
      <div className="overflow-y-auto flex-1 mt-3">
        <div className="space-y-1">
          {filtered.map((park) => {
            const [textColor] = getDesignationColors(park.designation);
            return (
              <Link
                key={park.parkCode}
                href={`/park/${park.parkCode}`}
                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group"
              >
                {park.imageUrl ? (
                  <img
                    src={park.imageUrl}
                    alt=""
                    className="w-8 h-8 rounded object-cover shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-white/5 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors truncate">
                    {park.fullName}
                  </p>
                  <p className={`text-[10px] ${textColor} truncate`}>
                    {park.designation}
                  </p>
                </div>
              </Link>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-xs text-[var(--color-text-muted)] text-center py-4">No parks found</p>
          )}
        </div>
      </div>
    </div>
  );
}
