export const runtime = "edge";

import { getParkByCode } from "@/lib/data";
import { fetchAlertsByPark, fetchNewsByPark } from "@/lib/nps";
import { getDesignationColors } from "@/lib/designation-colors";
import Image from "next/image";
import ParkGallery from "@/components/ParkGallery";
import BackLink from "@/components/BackLink";
import { notFound } from "next/navigation";

const ALERT_CATEGORY_STYLES: Record<string, string> = {
  Danger: "bg-red-500/10 text-red-400",
  Caution: "bg-amber-500/10 text-amber-400",
  Information: "bg-blue-500/10 text-blue-400",
  "Park Closure": "bg-red-500/10 text-red-400",
};

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { code } = await params;
  const park = getParkByCode(code);
  if (!park) return { title: "Park Not Found" };
  return {
    title: `${park.fullName} | NPS Explorer`,
    description: park.description,
  };
}

export default async function ParkPage({ params }: Props) {
  const { code } = await params;
  const park = getParkByCode(code);

  if (!park) notFound();

  const stateCode = park.states.split(",")[0].trim();
  const [desTextColor, desBgColor] = getDesignationColors(park.designation);

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const [rawAlerts, rawNews] = await Promise.all([
    fetchAlertsByPark(code).catch(() => []),
    fetchNewsByPark(code).catch(() => []),
  ]);

  const parkNews = rawNews
    .sort((a, b) => {
      const da = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
      const db = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
      return db - da;
    })
    .slice(0, 3);

  const recentAlerts = rawAlerts
    .filter((a) => {
      if (!a.lastIndexedDate) return false;
      return new Date(a.lastIndexedDate) >= threeMonthsAgo;
    })
    .sort((a, b) => new Date(b.lastIndexedDate).getTime() - new Date(a.lastIndexedDate).getTime())
    .slice(0, 3);

  return (
    <main className="min-h-screen page-enter">
      {/* Header */}
      <header className="sticky top-12 z-20 bg-[var(--color-bg)]/90 backdrop-blur border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4 relative flex items-center justify-center">
          <div className="absolute left-6">
            <BackLink href={`/state/${stateCode}`} />
          </div>
          <div className="text-center">
            <span className={`inline-block text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${desTextColor} ${desBgColor}`}>
              {park.designation}
            </span>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">
              {park.fullName}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        {/* Alerts */}
        {recentAlerts.length > 0 && (
          <div className="space-y-2">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/5"
              >
                {alert.category && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${ALERT_CATEGORY_STYLES[alert.category] || "bg-white/5 text-[var(--color-text-muted)]"}`}>
                    {alert.category}
                  </span>
                )}
                {alert.lastIndexedDate && (
                  <span className="text-[10px] text-[var(--color-text-muted)] shrink-0">
                    {new Date(alert.lastIndexedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                )}
                <p className="text-sm text-[var(--color-text-muted)] truncate flex-1 min-w-0">
                  {alert.title}
                </p>
                <a
                  href={alert.url || `https://www.nps.gov/${code.toLowerCase()}/planyourvisit/conditions.htm`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-white hover:text-[var(--color-accent)] transition-colors shrink-0"
                >
                  View &rarr;
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Gallery */}
        <ParkGallery images={park.images} />

        {/* Two-column layout: content + news */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2/3 — main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <section>
              <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                About
              </h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                {park.description}
              </p>
            </section>

            {/* Activities */}
            {park.activities.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                  Activities
                </h2>
                <div className="flex flex-wrap gap-2">
                  {park.activities.map((activity) => (
                    <span
                      key={activity.id}
                      className="text-xs px-3 py-1.5 rounded-full bg-[var(--color-surface)] border border-white/5 text-[var(--color-text-muted)]"
                    >
                      {activity.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Directions */}
            {park.directionsInfo && (
              <section>
                <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                  Directions
                </h2>
                <p className="text-[var(--color-text-muted)] leading-relaxed text-sm">
                  {park.directionsInfo}
                </p>
                {park.directionsUrl && (
                  <a
                    href={park.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-accent)] text-sm hover:underline mt-2 inline-block"
                  >
                    Get directions &rarr;
                  </a>
                )}
              </section>
            )}

            {/* Weather */}
            {park.weatherInfo && (
              <section>
                <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                  Weather
                </h2>
                <p className="text-[var(--color-text-muted)] leading-relaxed text-sm">
                  {park.weatherInfo}
                </p>
              </section>
            )}
          </div>

          {/* Right 1/3 — news + fees */}
          <div className="space-y-8">
            <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">News</h2>
            {parkNews.length > 0 ? (
              <div className="space-y-3">
                {parkNews.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg bg-[var(--color-surface)] border border-white/5 hover:border-[var(--color-accent-dim)] transition-colors overflow-hidden"
                  >
                    {item.image?.url && (
                      <div className="relative h-32 overflow-hidden">
                        <Image
                          src={item.image.url}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="300px"
                        />
                      </div>
                    )}
                    <div className="p-3">
                      {item.releaseDate && (
                        <span className="text-[10px] text-[var(--color-text-muted)]">
                          {new Date(item.releaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      )}
                      <p className="text-sm text-[var(--color-text)] line-clamp-2 mt-0.5">
                        {item.title}
                      </p>
                      {item.abstract && (
                        <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mt-1">
                          {item.abstract}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--color-text-muted)]">No recent news</p>
            )}
            </div>

            {/* Entrance Fees */}
            {park.entranceFees.length > 0 && (
              <InfoSection title="Entrance Fees">
                <div className="space-y-2">
                  {park.entranceFees.slice(0, 4).map((fee, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--color-text-muted)]">
                          {fee.title}
                        </span>
                        <span className="text-[var(--color-accent)] font-medium">
                          ${fee.cost}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </InfoSection>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--color-surface)] rounded-xl p-5 border border-white/5">
      <h3 className="text-sm font-medium text-[var(--color-accent)] mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

