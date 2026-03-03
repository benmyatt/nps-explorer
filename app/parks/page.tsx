import { getAllParks } from "@/lib/nps";
import type { Metadata } from "next";
import ParksGrid from "./ParksGrid";

export const metadata: Metadata = {
  title: "All Parks | NPS Explorer",
  description: "Browse all national parks in the United States",
};

export default async function ParksPage() {
  const parks = await getAllParks();

  const parkData = parks
    .sort((a, b) => a.fullName.localeCompare(b.fullName))
    .map((p) => ({
      parkCode: p.parkCode,
      fullName: p.fullName,
      designation: p.designation,
      description: p.description,
      imageUrl: p.images[0]?.url ?? null,
      states: p.states.split(",").map((s) => s.trim()),
      activities: p.activities.map((a) => a.name),
    }));

  // Extract unique states and activities for filters
  const allStates = Array.from(new Set(parkData.flatMap((p) => p.states))).sort();
  const allActivities = Array.from(new Set(parkData.flatMap((p) => p.activities))).sort();

  const heroPark = parks.find((p) => p.parkCode === "cany")
    ?? parks[0];
  const heroImage = heroPark?.images[0]?.url ?? null;

  return (
    <main className="min-h-screen page-enter">
      <ParksGrid
        parks={parkData}
        states={allStates}
        activities={allActivities}
        totalCount={parks.length}
        heroImage={heroImage}
      />
    </main>
  );
}
