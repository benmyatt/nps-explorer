import { fetchAlerts } from "@/lib/nps";
import { getAllParks } from "@/lib/data";
import type { Metadata } from "next";
import AlertsList from "./AlertsList";

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

export default async function AlertsPage() {
  const parkNameMap = new Map(getAllParks().map((p) => [p.parkCode, p.fullName]));
  const alerts = (await fetchAlerts().catch(() => [] as Awaited<ReturnType<typeof fetchAlerts>>))
    .sort((a, b) => {
      const dateA = a.lastIndexedDate ? new Date(a.lastIndexedDate).getTime() : 0;
      const dateB = b.lastIndexedDate ? new Date(b.lastIndexedDate).getTime() : 0;
      return dateB - dateA;
    })
    .map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      category: a.category,
      url: a.url,
      parkCode: a.parkCode,
      parkName: parkNameMap.get(a.parkCode) || a.parkCode.toUpperCase(),
      date: formatDate(a.lastIndexedDate),
    }));

  return (
    <main className="min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Alerts</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{alerts.length} current alerts</p>
        </div>

        <AlertsList alerts={alerts} />
      </div>
    </main>
  );
}
