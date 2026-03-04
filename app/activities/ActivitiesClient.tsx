"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ActivityPark } from "@/lib/nps";


export default function ActivitiesClient({ activities }: { activities: ActivityPark[] }) {
  const [selected, setSelected] = useState<ActivityPark | null>(null);

  if (selected) {
    return (
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <button
              onClick={() => setSelected(null)}
              className="text-sm text-[var(--color-accent)] hover:underline mb-4 flex items-center gap-1"
            >
              &larr; Back to activities
            </button>
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-1">{selected.name}</h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              {selected.parks.length} park{selected.parks.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Link
          href={`/map?activity=${encodeURIComponent(selected.name)}`}
          className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-surface)] border border-white/5 hover:border-[var(--color-accent-dim)] transition-colors group"
        >
          <p className="text-sm text-[var(--color-text-muted)]">
            Want to see parks with <span className="text-[var(--color-text)] font-medium">{selected.name}</span> on a map?
          </p>
          <span className="text-sm text-[var(--color-accent)] group-hover:underline shrink-0 ml-4">
            View Map &rarr;
          </span>
        </Link>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-4">
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Activities</h1>
        <p className="text-sm text-[var(--color-text-muted)]">{activities.length} activities across national parks</p>
      </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {activities.map((activity) => (
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
    </div>
  );
}
