import parksData from "@/data/parks.json";
import activitiesData from "@/data/activities.json";
import campgroundsData from "@/data/campgrounds.json";
import alertsData from "@/data/alerts.json";
import type { Park, ActivityPark, Campground, NPSAlert } from "./nps";

const EXCLUDED_DESIGNATIONS = new Set([
  "National Historic Trail",
  "National Scenic Trail",
  "National Geologic Trail",
  "Affiliated Area",
  "Park",
]);

function filterParks(parks: Park[]): Park[] {
  return parks.filter(
    (p) =>
      !EXCLUDED_DESIGNATIONS.has(p.designation) &&
      !p.designation.startsWith("Part of")
  );
}

const allParks = filterParks(parksData as Park[]);
const parksByCode = new Map(allParks.map((p) => [p.parkCode, p]));

export function getAllParks(): Park[] {
  return allParks;
}

export function getParkByCode(code: string): Park | null {
  return parksByCode.get(code) ?? null;
}

export function getParksByState(stateCode: string): Park[] {
  const upper = stateCode.toUpperCase();
  return allParks.filter((p) =>
    p.states.split(",").some((s) => s.trim() === upper)
  );
}

export function getActivitiesParks(): ActivityPark[] {
  return activitiesData as ActivityPark[];
}

export function getParkImageMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const p of allParks) {
    if (p.images[0]?.url) map.set(p.parkCode, p.images[0].url);
  }
  return map;
}

const allCampgrounds = campgroundsData as unknown as Campground[];
const campgroundsById = new Map(allCampgrounds.map((c) => [c.id, c]));

export function getAllCampgrounds(): Campground[] {
  return allCampgrounds;
}

export function getCampgroundById(id: string): Campground | null {
  return campgroundsById.get(id) ?? null;
}

export function getCampgroundsByState(stateCode: string): Campground[] {
  const upper = stateCode.toUpperCase();
  return allCampgrounds.filter((c) =>
    c.addresses?.some((a) => a.stateCode === upper)
  );
}

const allAlerts = alertsData as unknown as NPSAlert[];

export function getAlertsByState(stateCode: string): NPSAlert[] {
  const upper = stateCode.toUpperCase();
  const parkCodes = new Set(
    allParks
      .filter((p) => p.states.split(",").some((s) => s.trim() === upper))
      .map((p) => p.parkCode)
  );
  return allAlerts.filter((a) => parkCodes.has(a.parkCode));
}

export { parksToMarkers, campgroundsToMarkers } from "./nps";
