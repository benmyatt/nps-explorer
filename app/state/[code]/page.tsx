import { getParksByState, parksToMarkers, fetchAlertsByState } from "@/lib/nps";
import { getStateName, STATE_NAMES } from "@/lib/states";
import StateMap from "@/components/StateMap";
import ParkCard from "@/components/ParkCard";
import BackLink from "@/components/BackLink";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { code } = await params;
  const name = getStateName(code.toUpperCase());
  return {
    title: `${name} Parks | NPS Explorer`,
    description: `Explore national parks in ${name}`,
  };
}

export default async function StatePage({ params }: Props) {
  const { code } = await params;
  const stateCode = code.toUpperCase();

  if (!STATE_NAMES[stateCode]) {
    notFound();
  }

  const [parks, alerts] = await Promise.all([
    getParksByState(stateCode),
    fetchAlertsByState(stateCode),
  ]);
  const markers = parksToMarkers(parks);
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

  return (
    <main className="min-h-screen page-enter">
      {/* Header */}
      <header className="sticky top-12 z-20 bg-[var(--color-bg)]/90 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <BackLink href="/" />
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)]">
              {stateName}
            </h1>
            <p className="text-xs text-[var(--color-text-muted)]">
              {parks.length} park{parks.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-121px)]">
        {/* Map */}
        <div className="lg:w-1/2 h-[40vh] lg:h-auto lg:sticky lg:top-[121px] lg:self-start">
          <StateMap stateCode={stateCode} parkMarkers={markers} />
        </div>

        {/* Park list */}
        <div className="lg:w-1/2 p-6">
          {parks.length === 0 ? (
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
                  <div key={park.parkCode} className="relative">
                    {alert && (
                      <div className="absolute top-0 inset-x-0 z-10 px-2 py-1.5 bg-black/70 backdrop-blur-sm rounded-t-xl flex items-center gap-1.5 overflow-hidden">
                        <span className={`text-[9px] uppercase font-medium px-1.5 py-0.5 rounded-full shrink-0 ${
                          alert.category === "Danger" || alert.category === "Park Closure"
                            ? "text-red-400 bg-red-500/10"
                            : alert.category === "Caution"
                              ? "text-amber-400 bg-amber-500/10"
                              : "text-blue-400 bg-blue-500/10"
                        }`}>
                          {alert.category}
                        </span>
                        <span className="text-[10px] text-white/50 shrink-0">
                          {new Date(alert.lastIndexedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        <span className="text-[10px] text-white/70 truncate">{alert.title}</span>
                      </div>
                    )}
                    <ParkCard
                      parkCode={park.parkCode}
                      name={park.fullName}
                      designation={park.designation}
                      imageUrl={park.images[0]?.url ?? null}
                      description={park.description}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
