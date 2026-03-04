import { fetchEvents } from "@/lib/nps";
import type { Metadata } from "next";
import EventsList from "./EventsList";

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
  const events = (await fetchEvents().catch(() => [] as Awaited<ReturnType<typeof fetchEvents>>))
    .sort((a, b) => {
      const dateA = a.datestart ? new Date(a.datestart).getTime() : 0;
      const dateB = b.datestart ? new Date(b.datestart).getTime() : 0;
      return dateB - dateA;
    })
    .map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description ? stripHtml(e.description) : "",
      dateLabel: e.datestart
        ? formatDate(e.datestart) + (e.dateend && e.dateend !== e.datestart ? ` – ${formatDate(e.dateend)}` : "")
        : "",
      parkfullname: e.parkfullname,
      sitecode: e.sitecode,
      isfree: e.isfree,
      isallday: e.isallday,
      isrecurring: e.isrecurring,
      location: e.location,
    }));

  return (
    <main className="min-h-screen page-enter">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Events</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{events.length} upcoming events</p>
        </div>

        <EventsList events={events} />
      </div>
    </main>
  );
}
