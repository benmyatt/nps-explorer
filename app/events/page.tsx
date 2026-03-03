import { fetchEvents } from "@/lib/nps";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Events | NPS Explorer",
  description: "Upcoming events at national parks",
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default async function EventsPage() {
  const events = (await fetchEvents()).sort((a, b) => {
    const dateA = a.datestart ? new Date(a.datestart).getTime() : 0;
    const dateB = b.datestart ? new Date(b.datestart).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <main className="min-h-screen page-enter">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Events</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{events.length} upcoming events</p>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
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
                {event.datestart && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] shrink-0">
                    {formatDate(event.datestart)}
                    {event.dateend && event.dateend !== event.datestart && ` – ${formatDate(event.dateend)}`}
                  </span>
                )}
              </div>
              {event.description && (
                <p className="text-sm text-[var(--color-text-muted)] line-clamp-3">
                  {stripHtml(event.description)}
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
        </div>
      </div>
    </main>
  );
}
