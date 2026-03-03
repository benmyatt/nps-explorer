import { getAllParks, parksToMarkers } from "@/lib/nps";
import HomeMap from "@/components/HomeMap";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Park Map | NPS Explorer",
  description: "Interactive map of all national parks",
};

export default async function MapPage() {
  const parks = await getAllParks();
  const markers = parksToMarkers(parks);

  return (
    <main className="relative w-screen overflow-hidden page-enter" style={{ height: "calc(100vh - 48px)" }}>
      <HomeMap parkMarkers={markers} />
    </main>
  );
}
