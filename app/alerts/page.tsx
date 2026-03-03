import { fetchAlerts } from "@/lib/nps";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Alerts | NPS Explorer",
  description: "Current alerts and closures at national parks",
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

const CATEGORY_STYLES: Record<string, string> = {
  Danger: "bg-red-500/10 text-red-400",
  Caution: "bg-amber-500/10 text-amber-400",
  Information: "bg-blue-500/10 text-blue-400",
  "Park Closure": "bg-red-500/10 text-red-400",
};

export default async function AlertsPage() {
  const alerts = (await fetchAlerts()).sort((a, b) => {
    const dateA = a.lastIndexedDate ? new Date(a.lastIndexedDate).getTime() : 0;
    const dateB = b.lastIndexedDate ? new Date(b.lastIndexedDate).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <main className="min-h-screen page-enter">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Alerts</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{alerts.length} current alerts</p>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-5 rounded-xl bg-[var(--color-surface)] border border-white/5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-[var(--color-text)]">{alert.title}</h3>
                  <Link
                    href={`/park/${alert.parkCode}`}
                    className="text-xs text-[var(--color-accent)] hover:underline"
                  >
                    {alert.parkCode.toUpperCase()}
                  </Link>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {alert.category && (
                    <span className={`text-xs px-2.5 py-1 rounded-full ${CATEGORY_STYLES[alert.category] || "bg-white/5 text-[var(--color-text-muted)]"}`}>
                      {alert.category}
                    </span>
                  )}
                  {alert.lastIndexedDate && (
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {formatDate(alert.lastIndexedDate)}
                    </span>
                  )}
                </div>
              </div>
              {alert.description && (
                <p className="text-sm text-[var(--color-text-muted)] line-clamp-3">
                  {alert.description}
                </p>
              )}
              {alert.url && (
                <a
                  href={alert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--color-accent)] hover:underline mt-2 inline-block"
                >
                  More info &rarr;
                </a>
              )}
            </div>
          ))}
          {alerts.length === 0 && (
            <p className="text-center py-12 text-[var(--color-text-muted)]">No alerts found</p>
          )}
        </div>
      </div>
    </main>
  );
}
