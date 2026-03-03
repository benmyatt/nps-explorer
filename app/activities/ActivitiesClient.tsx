"use client";

import { useState } from "react";
import Link from "next/link";
import type { ActivityPark } from "@/lib/nps";

export default function ActivitiesClient({ activities }: { activities: ActivityPark[] }) {
  const [selected, setSelected] = useState<ActivityPark | null>(null);

  if (selected) {
    return (
      <div>
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-[var(--color-accent)] hover:underline mb-4 flex items-center gap-1"
        >
          &larr; Back to activities
        </button>
        <h2 className="text-xl font-semibold text-[var(--color-text)] mb-1">{selected.name}</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          {selected.parks.length} park{selected.parks.length !== 1 ? "s" : ""}
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {selected.parks.map((park) => (
            <Link
              key={park.parkCode}
              href={`/park/${park.parkCode}`}
              className="block p-4 rounded-lg bg-[var(--color-surface)] border border-white/5 hover:border-[var(--color-accent-dim)] transition-colors"
            >
              <p className="text-xs text-[var(--color-accent)] font-medium uppercase tracking-wider mb-1">
                {park.designation || "Park"}
              </p>
              <p className="font-medium text-[var(--color-text)]">{park.fullName}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{park.states}</p>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {activities
        .sort((a, b) => b.parks.length - a.parks.length)
        .map((activity) => (
          <button
            key={activity.id}
            onClick={() => setSelected(activity)}
            className="text-left p-4 rounded-lg bg-[var(--color-surface)] border border-white/5 hover:border-[var(--color-accent-dim)] transition-colors"
          >
            <h3 className="font-medium text-[var(--color-text)]">{activity.name}</h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {activity.parks.length} park{activity.parks.length !== 1 ? "s" : ""}
            </p>
          </button>
        ))}
    </div>
  );
}
