import { getParkByCode } from "@/lib/nps";
import { getDesignationColors } from "@/lib/designation-colors";
import ParkGallery from "@/components/ParkGallery";
import BackLink from "@/components/BackLink";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { code } = await params;
  const park = await getParkByCode(code);
  if (!park) return { title: "Park Not Found" };
  return {
    title: `${park.fullName} | NPS Explorer`,
    description: park.description,
  };
}

export default async function ParkPage({ params }: Props) {
  const { code } = await params;
  const park = await getParkByCode(code);

  if (!park) notFound();

  const stateCode = park.states.split(",")[0].trim();
  const physicalAddress = park.addresses.find((a) => a.type === "Physical");
  const phone = park.contacts.phoneNumbers.find((p) => p.type === "Voice");
  const email = park.contacts.emailAddresses[0];
  const [desTextColor, desBgColor] = getDesignationColors(park.designation);

  return (
    <main className="min-h-screen page-enter">
      {/* Header */}
      <header className="sticky top-12 z-20 bg-[var(--color-bg)]/90 backdrop-blur border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <BackLink href={`/state/${stateCode}`} />
          <div>
            <span className={`inline-block text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${desTextColor} ${desBgColor}`}>
              {park.designation}
            </span>
            <h1 className="text-lg font-bold text-[var(--color-text)]">
              {park.fullName}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        {/* Gallery */}
        <ParkGallery images={park.images} />

        {/* Description */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
            About
          </h2>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            {park.description}
          </p>
        </section>

        {/* Info grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Contact */}
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
            <InfoItem label="Website" value="Official NPS Page" href={park.url} />
          </InfoSection>

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

          {/* Operating Hours */}
          {park.operatingHours.length > 0 && (
            <InfoSection title="Hours">
              <div className="space-y-1 text-sm">
                {Object.entries(
                  park.operatingHours[0].standardHours
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
          className="text-sm text-[var(--color-accent)] hover:underline"
        >
          {value}
        </a>
      ) : (
        <span className="text-sm text-[var(--color-text)]">{value}</span>
      )}
    </div>
  );
}
