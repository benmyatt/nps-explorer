import { getAllParks, getActivitiesParks } from "@/lib/data";
import { fetchAlerts, fetchNewsReleases } from "@/lib/nps";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ParksList from "./ParksList";

export const metadata: Metadata = {
  title: "NPS Explorer",
  description: "Explore national parks, activities, alerts, and news",
};

const CATEGORY_STYLES: Record<string, string> = {
  Danger: "bg-red-500/10 text-red-400",
  Caution: "bg-amber-500/10 text-amber-400",
  Information: "bg-blue-500/10 text-blue-400",
  "Park Closure": "bg-red-500/10 text-red-400",
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default async function HomePage() {
  const parks = getAllParks();
  const activities = getActivitiesParks();
  const [alerts, news] = await Promise.all([
    fetchAlerts().catch(() => []),
    fetchNewsReleases().catch(() => []),
  ]);

  const sortedParks = [...parks].sort((a, b) => a.fullName.localeCompare(b.fullName));
  const heroImage = (parks.find((p) => p.parkCode === "brca") ?? parks[0])?.images[0]?.url ?? null;
  const mapImage = (parks.find((p) => p.parkCode === "yell") ?? parks[0])?.images[0]?.url ?? null;

  const parkNameMap = new Map(parks.map((p) => [p.parkCode, p.fullName]));
  const recentAlerts = [...alerts]
    .sort((a, b) => {
      const da = a.lastIndexedDate ? new Date(a.lastIndexedDate).getTime() : 0;
      const db = b.lastIndexedDate ? new Date(b.lastIndexedDate).getTime() : 0;
      return db - da;
    })
    .slice(0, 10);

  const recentNews = [...news]
    .sort((a, b) => {
      const da = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
      const db = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
      return db - da;
    })
    .slice(0, 10);

  return (
    <main className="page-enter">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {heroImage && (
          <Image src={heroImage} alt="" fill priority className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/30 sm:bg-black/50" />
        <div className="relative flex items-center justify-center py-16 sm:py-32 z-10">
          <h1 className="text-2xl sm:text-5xl font-bold text-white text-center px-6">Explore America&apos;s National Parks</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 pb-[136px] sm:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ height: "calc(100vh + 200px)" }}>
          {/* Left column — All Parks */}
          <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 flex flex-col overflow-hidden">
            <div className="px-4 pt-4 pb-3 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[var(--color-text)]">All Parks</h2>
              </div>
            </div>
            <div className="flex-1 overflow-hidden px-4 pb-4">
              <ParksList parks={sortedParks.map(p => ({
                parkCode: p.parkCode,
                fullName: p.fullName,
                designation: p.designation,
                imageUrl: p.images[0]?.url ?? null,
              }))} />
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Map preview */}
            <Link href="/map" className="block rounded-xl bg-[var(--color-surface)] border border-white/5 overflow-hidden relative group flex-1 min-h-[200px]">
              {mapImage && (
                <Image src={mapImage} alt="" fill priority className="object-cover group-hover:scale-105 transition-transform duration-500" />
              )}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <h2 className="text-2xl font-bold text-white">Interactive Park Map</h2>
                <p className="text-sm text-white/80 group-hover:text-white transition-colors mt-1">
                  View &rarr;
                </p>
              </div>
            </Link>

            {/* Activities */}
            <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[var(--color-text)]">Activities</h2>
                <Link href="/activities" className="text-xs text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors">View all &rarr;</Link>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activities.slice(0, 20).map((a) => (
                  <Link
                    key={a.id}
                    href="/activities"
                    className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-[var(--color-text-muted)] hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] transition-colors"
                  >
                    {a.name}
                  </Link>
                ))}
                {activities.length > 20 && (
                  <Link
                    href="/activities"
                    className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-[var(--color-accent)]"
                  >
                    +{activities.length - 20} more
                  </Link>
                )}
              </div>
            </div>

            {/* Alerts & Newsroom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Alerts */}
              <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-[var(--color-text)]">Alerts</h2>
                  <Link href="/alerts" className="text-xs text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors">View all &rarr;</Link>
                </div>
                <div className="space-y-2">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id}>
                      <Link href={`/park/${alert.parkCode}`} className="text-[10px] text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors truncate block">
                        {parkNameMap.get(alert.parkCode) || alert.parkCode.toUpperCase()}
                      </Link>
                      <div className="flex items-center gap-2">
                        {alert.category && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${CATEGORY_STYLES[alert.category] || "bg-white/5 text-[var(--color-text-muted)]"}`}>
                            {alert.category}
                          </span>
                        )}
                        <p className="text-xs text-[var(--color-text-muted)] truncate flex-1 min-w-0">
                          {alert.title}
                        </p>
                        {alert.url ? (
                          <a href={alert.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors shrink-0">View &rarr;</a>
                        ) : (
                          <Link href={`/park/${alert.parkCode}`} className="text-[10px] text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors shrink-0">View &rarr;</Link>
                        )}
                      </div>
                    </div>
                  ))}
                  {recentAlerts.length === 0 && (
                    <p className="text-xs text-[var(--color-text-muted)]">No current alerts</p>
                  )}
                </div>
              </div>

              {/* Newsroom */}
              <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-[var(--color-text)]">Newsroom</h2>
                  <Link href="/newsroom" className="text-xs text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors">View all &rarr;</Link>
                </div>
                <div className="space-y-3">
                  {recentNews.map((item) => (
                    <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="block group">
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] text-[var(--color-text-muted)] shrink-0 mt-0.5 w-12">
                          {formatDate(item.releaseDate)}
                        </span>
                        <p className="text-xs text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors line-clamp-2">
                          {item.title}
                        </p>
                      </div>
                    </a>
                  ))}
                  {recentNews.length === 0 && (
                    <p className="text-xs text-[var(--color-text-muted)]">No recent news</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
