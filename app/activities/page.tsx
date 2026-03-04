import { getActivitiesParks } from "@/lib/data";
import type { Metadata } from "next";
import ActivitiesClient from "./ActivitiesClient";

export const metadata: Metadata = {
  title: "Activities | NPS Explorer",
  description: "Explore activities available across national parks",
};

export default async function ActivitiesPage() {
  const activities = getActivitiesParks().sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ActivitiesClient activities={activities} />
      </div>
    </main>
  );
}
