import type { Metadata } from "next";
import BackLink from "@/components/BackLink";
import APIExplorerClient from "./APIExplorerClient";

export const metadata: Metadata = {
  title: "API Field Explorer | NPS Explorer",
  description: "Complete field reference for the National Park Service Developer API",
};

const ENDPOINTS = [
  { name: "Parks", path: "/parks", desc: "Info about national parks including locations, hours, fees, images" },
  { name: "Alerts", path: "/alerts", desc: "Current alerts and closures for parks" },
  { name: "Activities", path: "/activities", desc: "Activity categories available across parks" },
  { name: "Amenities", path: "/amenities", desc: "Amenity types available at parks" },
  { name: "Articles", path: "/articles", desc: "NPS articles and educational content" },
  { name: "Campgrounds", path: "/campgrounds", desc: "Campground info including sites, fees, amenities" },
  { name: "Events", path: "/events", desc: "Park events, programs, and closures" },
  { name: "Lesson Plans", path: "/lessonplans", desc: "Educational lesson plans for teachers" },
  { name: "News Releases", path: "/newsreleases", desc: "Press releases and news from NPS" },
  { name: "People", path: "/people", desc: "Historical people associated with parks" },
  { name: "Places", path: "/places", desc: "Significant places and landmarks" },
  { name: "Things To Do", path: "/thingstodo", desc: "Activities and experiences at parks" },
  { name: "Tours", path: "/tours", desc: "Guided and self-guided tours" },
  { name: "Visitor Centers", path: "/visitorcenters", desc: "Visitor center locations and info" },
];

const NPS_API_KEY = process.env.NPS_API_KEY || "DEMO_KEY";
const BASE = "https://developer.nps.gov/api/v1";

interface Field {
  key: string;
  path: string;
  type: string;
  sample: string;
  children: Field[];
}

function getType(val: unknown): string {
  if (val === null) return "null";
  if (Array.isArray(val)) return "array";
  return typeof val;
}

function flattenFields(obj: Record<string, unknown>, prefix = ""): Field[] {
  const fields: Field[] = [];
  if (!obj || typeof obj !== "object") return fields;

  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const type = getType(val);

    let sample = "";
    let children: Field[] = [];

    if (type === "string") {
      const s = val as string;
      sample = s.length > 80 ? s.slice(0, 80) + "..." : s;
    } else if (type === "number" || type === "boolean") {
      sample = String(val);
    } else if (type === "array") {
      const arr = val as unknown[];
      if (arr.length > 0) {
        const first = arr[0];
        if (typeof first === "object" && first !== null) {
          children = flattenFields(first as Record<string, unknown>, path + "[]");
          sample = `Array of ${arr.length} object(s)`;
        } else {
          sample = `[${arr.slice(0, 3).map((v) => JSON.stringify(v)).join(", ")}${arr.length > 3 ? ", ..." : ""}]`;
        }
      }
    } else if (type === "object") {
      const o = val as Record<string, unknown>;
      children = flattenFields(o, path);
      sample = `{${Object.keys(o).length} fields}`;
    }

    fields.push({ key, path, type, sample, children });
  }
  return fields;
}

interface EndpointData {
  name: string;
  path: string;
  desc: string;
  total: string;
  fields: Field[];
}

async function fetchAllEndpoints(): Promise<EndpointData[]> {
  const results = await Promise.all(
    ENDPOINTS.map(async (ep) => {
      try {
        const res = await fetch(`${BASE}${ep.path}?limit=1&api_key=${NPS_API_KEY}`, {
          next: { revalidate: 86400 },
        });
        const json = await res.json();
        const total = json.total || "0";
        const fields =
          json.data && json.data.length > 0
            ? flattenFields(json.data[0])
            : [];
        return { ...ep, total, fields };
      } catch {
        return { ...ep, total: "0", fields: [] };
      }
    })
  );
  return results;
}

export default async function APIExplorerPage() {
  const endpoints = await fetchAllEndpoints();
  const totalRecords = endpoints.reduce((sum, e) => sum + parseInt(e.total || "0"), 0);

  return (
    <main className="min-h-screen page-enter">
      <header className="sticky top-12 z-20 bg-[var(--color-bg)]/90 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <BackLink href="/" />
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)]">
              API Field Explorer
            </h1>
            <p className="text-xs text-[var(--color-text-muted)]">
              National Park Service Developer API
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-[var(--color-surface)] border border-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-[var(--color-accent)]">{endpoints.length}</div>
            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Endpoints</div>
          </div>
          <div className="bg-[var(--color-surface)] border border-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-[var(--color-accent)]">{totalRecords.toLocaleString()}</div>
            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Total Records</div>
          </div>
          <div className="bg-[var(--color-surface)] border border-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-[var(--color-accent)]">v1</div>
            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">API Version</div>
          </div>
          <div className="bg-[var(--color-surface)] border border-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-[var(--color-accent)]">REST</div>
            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Protocol</div>
          </div>
        </div>

        {/* Nav pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {endpoints.map((ep) => (
            <a
              key={ep.path}
              href={`#${ep.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-xs px-3 py-1.5 rounded border border-white/10 text-[var(--color-accent)] hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              {ep.name}
            </a>
          ))}
        </div>

        {/* Endpoints */}
        <APIExplorerClient endpoints={endpoints} />
      </div>
    </main>
  );
}
