export const runtime = "edge";

import { getCampgroundById } from "@/lib/data";
import ParkGallery from "@/components/ParkGallery";
import BackLink from "@/components/BackLink";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const cg = getCampgroundById(id);
  if (!cg) return { title: "Campground Not Found" };
  return {
    title: `${cg.name} | NPS Explorer`,
    description: cg.description,
  };
}

export default async function CampgroundPage({ params }: Props) {
  const { id } = await params;
  const cg = getCampgroundById(id);

  if (!cg) notFound();

  const stateCode = cg.addresses?.[0]?.stateCode || "";
  const physicalAddress = cg.addresses?.find((a) => a.type === "Physical");
  const phone = cg.contacts?.phoneNumbers?.find((p) => p.type === "Voice");
  const email = cg.contacts?.emailAddresses?.[0];

  const campsites = cg.campsites || {};
  const siteStats = [
    { label: "Total Sites", value: campsites.totalSites },
    { label: "Tent Only", value: campsites.tentOnly },
    { label: "RV Only", value: campsites.rvOnly },
    { label: "Electric Hookups", value: campsites.electricalHookups },
    { label: "Walk/Boat-in", value: campsites.walkBoatTo },
    { label: "Group", value: campsites.group },
    { label: "Horse", value: campsites.horse },
  ].filter((s) => s.value && s.value !== "0");

  return (
    <main className="min-h-screen page-enter">
      {/* Header */}
      <header className="sticky top-12 z-20 bg-[var(--color-bg)]/90 backdrop-blur border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <BackLink href={stateCode ? `/state/${stateCode}?view=campgrounds` : "/map"} />
          <div>
            <span className="inline-block text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-full text-white bg-white/10">
              Campground
            </span>
            <h1 className="text-lg font-bold text-[var(--color-text)]">
              {cg.name}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        {/* Gallery */}
        {cg.images && cg.images.length > 0 && (
          <ParkGallery images={cg.images} />
        )}

        {/* Description */}
        {cg.description && (
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              About
            </h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              {cg.description}
            </p>
          </section>
        )}

        {/* Campsite stats */}
        {siteStats.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              Campsites
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {siteStats.map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-[var(--color-surface)] rounded-xl p-4 border border-white/5 text-center"
                >
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-1">{label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Info grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Contact */}
          {(phone || email || cg.url) && (
            <InfoSection title="Contact">
              {phone && (
                <InfoItem
                  label="Phone"
                  value={phone.phoneNumber}
                  href={`tel:${phone.phoneNumber}`}
                />
              )}
              {email && (
                <InfoItem
                  label="Email"
                  value={email.emailAddress}
                  href={`mailto:${email.emailAddress}`}
                />
              )}
              {cg.url && (
                <InfoItem label="Website" value="Official NPS Page" href={cg.url} />
              )}
            </InfoSection>
          )}

          {/* Address */}
          {physicalAddress && (
            <InfoSection title="Location">
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                {physicalAddress.line1}
                {physicalAddress.line2 && <br />}
                {physicalAddress.line2}
                <br />
                {physicalAddress.city}, {physicalAddress.stateCode}{" "}
                {physicalAddress.postalCode}
              </p>
            </InfoSection>
          )}

          {/* Fees */}
          {cg.fees && cg.fees.length > 0 && (
            <InfoSection title="Fees">
              <div className="space-y-2">
                {cg.fees.slice(0, 4).map((fee, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">
                        {fee.title}
                      </span>
                      <span className="text-white font-medium">
                        ${fee.cost}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </InfoSection>
          )}

          {/* Operating Hours */}
          {cg.operatingHours && cg.operatingHours.length > 0 && (
            <InfoSection title="Hours">
              <div className="space-y-1 text-sm">
                {cg.operatingHours[0].description && (
                  <p className="text-[var(--color-text-muted)] mb-2">{cg.operatingHours[0].description}</p>
                )}
                {Object.entries(
                  cg.operatingHours[0].standardHours
                ).map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex justify-between text-[var(--color-text-muted)]"
                  >
                    <span className="capitalize">{day}</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
            </InfoSection>
          )}
        </div>

        {/* Reservation */}
        {cg.reservationInfo && (
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              Reservations
            </h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed text-sm">
              {cg.reservationInfo}
            </p>
            {cg.reservationUrl && (
              <a
                href={cg.reservationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
              >
                Make a Reservation &rarr;
              </a>
            )}
          </section>
        )}

        {/* Directions */}
        {cg.directionsOverview && (
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              Directions
            </h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed text-sm">
              {cg.directionsOverview}
            </p>
          </section>
        )}

        {/* Weather */}
        {cg.weatherOverview && (
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              Weather
            </h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed text-sm">
              {cg.weatherOverview}
            </p>
          </section>
        )}

        {/* Accessibility */}
        {cg.accessibility && Object.values(cg.accessibility).some((v) => v) && (
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              Accessibility
            </h2>
            <div className="space-y-2">
              {Object.entries(cg.accessibility)
                .filter(([, v]) => v)
                .map(([key, value]) => (
                  <div key={key}>
                    <span className="text-xs font-medium text-[var(--color-text)] capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <p className="text-sm text-[var(--color-text-muted)]">{value}</p>
                  </div>
                ))}
            </div>
          </section>
        )}
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
      <h3 className="text-sm font-medium text-white mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoItem({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="mb-2 last:mb-0">
      <span className="text-xs text-[var(--color-text-muted)] block">
        {label}
      </span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white hover:underline"
        >
          {value}
        </a>
      ) : (
        <span className="text-sm text-[var(--color-text)]">{value}</span>
      )}
    </div>
  );
}
