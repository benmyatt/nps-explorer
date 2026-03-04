import fs from "fs";
import path from "path";

const NPS_API_KEY = process.env.NPS_API_KEY || "DEMO_KEY";
const NPS_BASE = "https://developer.nps.gov/api/v1";
const DATA_DIR = path.join(process.cwd(), "data");

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

  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url.toString());
    if (res.status === 429) {
      console.log(`  Rate limited, retrying in ${(attempt + 1)}s...`);
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) {
      throw new Error(`NPS API error: ${res.status} ${res.statusText}`);
    }
    const json: NPSResponse<T> = await res.json();
    return json.data;
  }
  throw new Error("Failed after 3 attempts");
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  console.log("Fetching parks...");
  const parks = await fetchNPS("parks", { limit: "500" });
  fs.writeFileSync(
    path.join(DATA_DIR, "parks.json"),
    JSON.stringify(parks, null, 2)
  );
  console.log(`  ${(parks as unknown[]).length} parks saved`);

  await delay(500);

  console.log("Fetching activities/parks...");
  const activities = await fetchNPS("activities/parks", { limit: "100" });
  fs.writeFileSync(
    path.join(DATA_DIR, "activities.json"),
    JSON.stringify(activities, null, 2)
  );
  console.log(`  ${(activities as unknown[]).length} activities saved`);

  await delay(500);

  console.log("Fetching campgrounds...");
  const campgrounds = await fetchNPS("campgrounds", { limit: "700" });
  fs.writeFileSync(
    path.join(DATA_DIR, "campgrounds.json"),
    JSON.stringify(campgrounds, null, 2)
  );
  console.log(`  ${(campgrounds as unknown[]).length} campgrounds saved`);

  await delay(500);

  console.log("Fetching alerts...");
  const alerts = await fetchNPS("alerts", { limit: "500" });
  fs.writeFileSync(
    path.join(DATA_DIR, "alerts.json"),
    JSON.stringify(alerts, null, 2)
  );
  console.log(`  ${(alerts as unknown[]).length} alerts saved`);

  const meta = { fetchedAt: new Date().toISOString() };
  fs.writeFileSync(
    path.join(DATA_DIR, "meta.json"),
    JSON.stringify(meta, null, 2)
  );

  console.log("Done! Data written to data/");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
