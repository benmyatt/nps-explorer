const NPS_API_KEY = process.env.NPS_API_KEY || "DEMO_KEY";
const NPS_BASE = "https://developer.nps.gov/api/v1";

export interface Park {
  id: string;
  parkCode: string;
  fullName: string;
  name: string;
  designation: string;
  description: string;
  directionsInfo: string;
  directionsUrl: string;
  url: string;
  weatherInfo: string;
  states: string;
  latitude: string;
  longitude: string;
  images: ParkImage[];
  addresses: ParkAddress[];
  contacts: ParkContacts;
  entranceFees: ParkFee[];
  entrancePasses: ParkFee[];
  operatingHours: ParkOperatingHours[];
  activities: { id: string; name: string }[];
  topics: { id: string; name: string }[];
}

export interface ParkImage {
  credit: string;
  title: string;
  altText: string;
  caption: string;
  url: string;
}

export interface ParkAddress {
  type: string;
  line1: string;
  line2: string;
  line3: string;
  city: string;
  stateCode: string;
  postalCode: string;
}

export interface ParkContacts {
  phoneNumbers: { phoneNumber: string; type: string }[];
  emailAddresses: { emailAddress: string }[];
}

export interface ParkFee {
  cost: string;
  description: string;
  title: string;
}

export interface ParkOperatingHours {
  name: string;
  description: string;
  standardHours: Record<string, string>;
  exceptions: { name: string; startDate: string; endDate: string }[];
}

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

interface NPSResponse<T> {
  total: string;
  limit: string;
  start: string;
  data: T[];
}

async function fetchNPS<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T[]> {
  const url = new URL(`${NPS_BASE}/${endpoint}`);
  url.searchParams.set("api_key", NPS_API_KEY);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  let res: Response | undefined;
  for (let attempt = 0; attempt < 3; attempt++) {
    res = await fetch(url.toString(), { next: { revalidate: 86400 } });
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      continue;
    }
    break;
  }
  if (!res || !res.ok) {
    throw new Error(`NPS API error: ${res?.status} ${res?.statusText}`);
  }

  const json: NPSResponse<T> = await res.json();
  return json.data;
}

export async function getAllParks(): Promise<Park[]> {
  const parks = await fetchNPS<Park>("parks", { limit: "500" });
  return filterParks(parks);
}

export async function getParksByState(stateCode: string): Promise<Park[]> {
  const parks = await fetchNPS<Park>("parks", {
    stateCode: stateCode.toUpperCase(),
    limit: "100",
  });
  return filterParks(parks);
}

export async function getParkByCode(parkCode: string): Promise<Park | null> {
  const parks = await fetchNPS<Park>("parks", { parkCode });
  return parks[0] ?? null;
}

export interface ParkMarker {
  parkCode: string;
  name: string;
  designation: string;
  lat: number;
  lng: number;
  stateCode: string;
  imageUrl: string | null;
  activities: string[];
}

// Activities/Parks
export interface ActivityPark {
  id: string;
  name: string;
  parks: { parkCode: string; fullName: string; states: string; designation: string; url: string }[];
}

export async function fetchActivitiesParks(): Promise<ActivityPark[]> {
  return fetchNPS<ActivityPark>("activities/parks", { limit: "100" });
}

// Alerts
export interface NPSAlert {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  parkCode: string;
  lastIndexedDate: string;
}

export async function fetchAlerts(): Promise<NPSAlert[]> {
  return fetchNPS<NPSAlert>("alerts", { limit: "100" });
}

export async function fetchAlertsByState(stateCode: string): Promise<NPSAlert[]> {
  return fetchNPS<NPSAlert>("alerts", { stateCode: stateCode.toUpperCase(), limit: "100" });
}

export async function fetchAlertsByPark(parkCode: string): Promise<NPSAlert[]> {
  return fetchNPS<NPSAlert>("alerts", { parkCode, limit: "50" });
}

// News Releases
export interface NPSNewsRelease {
  id: string;
  url: string;
  title: string;
  parkCode: string;
  abstract: string;
  releaseDate: string;
  lastIndexedDate: string;
  image: { url: string; credit: string; altText: string; title: string; caption: string };
}

export async function fetchNewsReleases(): Promise<NPSNewsRelease[]> {
  return fetchNPS<NPSNewsRelease>("newsreleases", { limit: "500" });
}

export async function fetchNewsByPark(parkCode: string): Promise<NPSNewsRelease[]> {
  return fetchNPS<NPSNewsRelease>("newsreleases", { parkCode, limit: "50" });
}

// Events
export interface NPSEvent {
  id: string;
  title: string;
  description: string;
  datestart: string;
  dateend: string;
  parkfullname: string;
  sitecode: string;
  organizationname: string;
  contactname: string;
  contactemailaddress: string;
  contacttelephonenumber: string;
  feeinfo: string;
  location: string;
  times: { timestart: string; timeend: string; sunsetend: boolean; sunrisestart: boolean }[];
  types: string[];
  category: string;
  tags: string[];
  recurrencedatestart: string;
  recurrencedateend: string;
  recurrencerule: string;
  isallday: boolean;
  isrecurring: boolean;
  isfree: boolean;
  regresurl: string;
  infourl: string;
  porpiurl: string;
  images: ParkImage[];
}

export async function fetchEvents(): Promise<NPSEvent[]> {
  const today = new Date().toISOString().split("T")[0];
  return fetchNPS<NPSEvent>("events", { limit: "50", dateStart: today });
}

// Lesson Plans
export interface LessonPlan {
  id: string;
  title: string;
  url: string;
  parkCode: string;
  subject: string;
  gradelevel: string;
  duration: string;
  questionobjective: string;
}

export async function fetchLessonPlans(): Promise<LessonPlan[]> {
  return fetchNPS<LessonPlan>("lessonplans", { limit: "50" });
}

export async function getParkImageMap(): Promise<Map<string, string>> {
  const parks = await getAllParks();
  const map = new Map<string, string>();
  for (const p of parks) {
    if (p.images[0]?.url) map.set(p.parkCode, p.images[0].url);
  }
  return map;
}

// Campgrounds
export interface Campground {
  id: string;
  name: string;
  parkCode: string;
  description: string;
  latitude: string;
  longitude: string;
  images: ParkImage[];
  addresses: ParkAddress[];
  contacts: ParkContacts;
  fees: { cost: string; description: string; title: string }[];
  operatingHours: ParkOperatingHours[];
  campsites: {
    totalSites: string;
    tentOnly: string;
    electricalHookups: string;
    rvOnly: string;
    walkBoatTo: string;
    group: string;
    horse: string;
    other: string;
  };
  amenities: Record<string, string>;
  accessibility: Record<string, string>;
  reservationInfo: string;
  reservationUrl: string;
  directionsOverview: string;
  weatherOverview: string;
  url: string;
}

export interface CampgroundMarker {
  id: string;
  name: string;
  parkCode: string;
  lat: number;
  lng: number;
  stateCode: string;
  totalSites: string;
  imageUrl: string | null;
}

export function campgroundsToMarkers(campgrounds: Campground[]): CampgroundMarker[] {
  return campgrounds
    .filter((c) => c.latitude && c.longitude && parseFloat(c.latitude) !== 0)
    .map((c) => ({
      id: c.id,
      name: c.name,
      parkCode: c.parkCode,
      lat: parseFloat(c.latitude),
      lng: parseFloat(c.longitude),
      stateCode: c.addresses?.[0]?.stateCode || "",
      totalSites: c.campsites?.totalSites || "0",
      imageUrl: c.images?.[0]?.url ?? null,
    }));
}

export function parksToMarkers(parks: Park[]): ParkMarker[] {
  return parks
    .filter((p) => p.latitude && p.longitude)
    .map((p) => ({
      parkCode: p.parkCode,
      name: p.fullName,
      designation: p.designation,
      lat: parseFloat(p.latitude),
      lng: parseFloat(p.longitude),
      stateCode: p.states.split(",")[0].trim(),
      imageUrl: p.images[0]?.url ?? null,
      activities: p.activities.map((a) => a.name),
    }));
}
