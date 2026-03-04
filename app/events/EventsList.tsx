"use client";

import { useState } from "react";
import Link from "next/link";

interface EventItem {
  id: string;
  title: string;
  description: string;
  dateLabel: string;
  parkfullname: string;
  sitecode: string;
  isfree: boolean;
  isallday: boolean;
  isrecurring: boolean;
  location: string;
}

const PAGE_SIZE = 20;

export default function EventsList({ events }: { events: EventItem[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = events.slice(0, visibleCount);

  return (
    <div className="space-y-4">
      {visible.map((event) => (
        <div
          key={event.id}
          className="p-5 rounded-xl bg-[var(--color-surface)] border border-white/5"
        >
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-[var(--color-text)]">{event.title}</h3>
              <Link
                href={`/park/${event.sitecode}`}
                className="text-xs text-[var(--color-accent)] hover:underline"
              >
                {event.parkfullname}
              </Link>
            </div>
            {event.dateLabel && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] shrink-0">
                {event.dateLabel}
              </span>
            )}
          </div>
          {event.description && (
            <p className="text-sm text-[var(--color-text-muted)] line-clamp-3">
              {event.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            {event.isfree && (
              <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400">Free</span>
            )}
            {event.isallday && (
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">All Day</span>
            )}
            {event.isrecurring && (
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">Recurring</span>
            )}
            {event.location && (
              <span className="text-xs text-[var(--color-text-muted)]">{event.location}</span>
            )}
          </div>
        </div>
      ))}
      {events.length === 0 && (
        <p className="text-center py-12 text-[var(--color-text-muted)]">No events found</p>
      )}
      {visibleCount < events.length && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="px-6 py-2.5 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-sm font-medium hover:bg-[var(--color-accent)]/20 transition-colors"
          >
            Show more ({events.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
