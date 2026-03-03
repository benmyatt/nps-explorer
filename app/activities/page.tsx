import { fetchActivitiesParks } from "@/lib/nps";
import type { Metadata } from "next";
import ActivitiesClient from "./ActivitiesClient";

export const metadata: Metadata = {
  title: "Activities | NPS Explorer",
  description: "Explore activities available across national parks",
};

export default async function ActivitiesPage() {
  const activities = await fetchActivitiesParks();

  return (
    <main className="min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Activities</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{activities.length} activities across national parks</p>
        </div>
        <ActivitiesClient activities={activities} />
      </div>
    </main>
  );
}
