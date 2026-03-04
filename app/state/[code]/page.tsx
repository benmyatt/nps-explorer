export const runtime = "edge";

import { getParksByState, parksToMarkers, getCampgroundsByState, campgroundsToMarkers, getAlertsByState } from "@/lib/data";
import { getStateName, STATE_NAMES } from "@/lib/states";
import { getDesignationGroup, LEGEND_ITEMS } from "@/lib/designation-colors";
import StateMap from "@/components/StateMap";
import ParkCard from "@/components/ParkCard";
import CampgroundCard from "@/components/CampgroundCard";
import BackLink from "@/components/BackLink";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ view?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { code } = await params;
  const name = getStateName(code.toUpperCase());
  return {
    title: `${name} Parks | NPS Explorer`,
    description: `Explore national parks in ${name}`,
  };
}

export default async function StatePage({ params, searchParams }: Props) {
  const { code } = await params;
  const { view } = await searchParams;
  const stateCode = code.toUpperCase();

  if (!STATE_NAMES[stateCode]) {
    notFound();
  }

  const isCampgroundView = view === "campgrounds";
  const parks = getParksByState(stateCode);
  const campgrounds = getCampgroundsByState(stateCode);
  const alerts = getAlertsByState(stateCode);
  const parkMarkers = parksToMarkers(parks);
  const cgMarkers = campgroundsToMarkers(campgrounds);
  const stateName = getStateName(stateCode);
  const sixMonthsAgo = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000;
  const alertsByPark = new Map<string, typeof alerts[0]>();
  for (const alert of alerts) {
    const date = alert.lastIndexedDate ? new Date(alert.lastIndexedDate).getTime() : 0;
    if (date < sixMonthsAgo) continue;
    const existing = alertsByPark.get(alert.parkCode);
    if (!existing || date > new Date(existing.lastIndexedDate).getTime()) {
      alertsByPark.set(alert.parkCode, alert);
    }
  }

  const presentGroups = new Set(parks.map((p) => getDesignationGroup(p.designation)));
  const stateDesignations = LEGEND_ITEMS.filter((item) => presentGroups.has(item.key));

  return (
    <main className="min-h-screen page-enter">
      {/* Header */}
      <header className="sticky top-12 z-20 bg-[var(--color-bg)]/90 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <BackLink href="/map" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-[var(--color-text)]">
              {stateName}
            </h1>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="text-xs text-[var(--color-text-muted)] shrink-0">
                {isCampgroundView
                  ? `${campgrounds.length} campground${campgrounds.length !== 1 ? "s" : ""}`
                  : `${parks.length} park${parks.length !== 1 ? "s" : ""}`}
              </span>
              {!isCampgroundView && stateDesignations.map(({ label, color, key }) => (
                <span key={key} className="flex items-center gap-1 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[10px] text-[var(--color-text-muted)]">{label}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="flex rounded-lg bg-white/5 p-0.5">
            <Link
              href={`/state/${code}`}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                !isCampgroundView
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              Parks
            </Link>
            <Link
              href={`/state/${code}?view=campgrounds`}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                isCampgroundView
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              Campgrounds
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-121px)]">
        {/* Map */}
        <div className="lg:w-1/2 h-[40vh] lg:h-auto lg:sticky lg:top-[121px] lg:self-start">
          <StateMap
            stateCode={stateCode}
            parkMarkers={isCampgroundView ? [] : parkMarkers}
            campgroundMarkers={isCampgroundView ? cgMarkers : []}
          />
        </div>

        {/* List */}
        <div className="lg:w-1/2 p-6">
          {isCampgroundView ? (
            campgrounds.length === 0 ? (
              <div className="text-center py-20 text-[var(--color-text-muted)]">
                <p className="text-lg">No campgrounds found in {stateName}</p>
                <Link
                  href={`/state/${code}`}
                  className="text-[var(--color-accent)] hover:underline mt-2 inline-block"
                >
                  View parks instead
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {campgrounds.map((cg) => (
                  <CampgroundCard
                    key={cg.id}
                    id={cg.id}
                    name={cg.name}
                    imageUrl={cg.images?.[0]?.url ?? null}
                    description={cg.description}
                    totalSites={cg.campsites?.totalSites}
                  />
                ))}
              </div>
            )
          ) : (
            parks.length === 0 ? (
              <div className="text-center py-20 text-[var(--color-text-muted)]">
                <p className="text-lg">No parks found in {stateName}</p>
                <Link
                  href="/"
                  className="text-[var(--color-accent)] hover:underline mt-2 inline-block"
                >
                  Back to map
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {parks.map((park) => {
                  const alert = alertsByPark.get(park.parkCode);
                  return (
                    <ParkCard
                      key={park.parkCode}
                      parkCode={park.parkCode}
                      name={park.fullName}
                      designation={park.designation}
                      imageUrl={park.images[0]?.url ?? null}
                      description={park.description}
                      alert={alert ? {
                        category: alert.category,
                        date: new Date(alert.lastIndexedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                        title: alert.title,
                        url: alert.url || undefined,
                      } : undefined}
                    />
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}
