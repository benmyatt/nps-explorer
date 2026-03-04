"use client";

import { useState } from "react";
import Link from "next/link";

interface AlertItem {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  parkCode: string;
  parkName: string;
  date: string;
}

const PAGE_SIZE = 20;

const CATEGORY_STYLES: Record<string, string> = {
  Danger: "bg-red-500/10 text-red-400",
  Caution: "bg-amber-500/10 text-amber-400",
  Information: "bg-blue-500/10 text-blue-400",
  "Park Closure": "bg-red-500/10 text-red-400",
};

export default function AlertsList({ alerts }: { alerts: AlertItem[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = alerts.slice(0, visibleCount);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((alert) => (
        <div
          key={alert.id}
          className="p-4 rounded-xl bg-[var(--color-surface)] border border-white/5 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-2">
            {alert.category && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${CATEGORY_STYLES[alert.category] || "bg-white/5 text-[var(--color-text-muted)]"}`}>
                {alert.category}
              </span>
            )}
            {alert.date && (
              <span className="text-[10px] text-[var(--color-text-muted)]">
                {alert.date}
              </span>
            )}
          </div>
          <Link
            href={`/park/${alert.parkCode}`}
            className="text-[10px] text-[var(--color-accent)] hover:underline mb-1"
          >
            {alert.parkName}
          </Link>
          <h3 className="text-sm font-semibold text-[var(--color-text)] line-clamp-2">{alert.title}</h3>
          {alert.description && (
            <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mt-1 flex-1">
              {alert.description}
            </p>
          )}
          {alert.url && (
            <a
              href={alert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors mt-2"
            >
              View &rarr;
            </a>
          )}
        </div>
      ))}
      {alerts.length === 0 && (
        <p className="text-center py-12 text-[var(--color-text-muted)]">No alerts found</p>
      )}
      {visibleCount < alerts.length && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="px-6 py-2.5 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-sm font-medium hover:bg-[var(--color-accent)]/20 transition-colors"
          >
            Show more ({alerts.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
