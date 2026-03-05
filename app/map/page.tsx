import { getAllParks, parksToMarkers, getAllCampgrounds, campgroundsToMarkers } from "@/lib/data";
import HomeMap from "@/components/HomeMap";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore | NPS Explorer",
  description: "Interactive map of national parks and campgrounds",
};

export default async function MapPage() {
  const parks = getAllParks();
  const markers = parksToMarkers(parks);
  const campgrounds = getAllCampgrounds();
  const cgMarkers = campgroundsToMarkers(campgrounds);

  return (
    <main className="relative w-full overflow-hidden page-enter" style={{ height: "calc(100dvh - 48px)" }}>
      <HomeMap parkMarkers={markers} campgroundMarkers={cgMarkers} />
    </main>
  );
}
