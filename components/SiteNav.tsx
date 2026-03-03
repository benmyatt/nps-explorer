"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "All Parks", href: "/parks" },
  { label: "Park Map", href: "/map" },
  { label: "Activities", href: "/activities" },
  { label: "Alerts", href: "/alerts" },
  { label: "Newsroom", href: "/newsroom" },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-30 bg-[var(--color-bg)]/90 backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-12 gap-1 overflow-x-auto scrollbar-hide">
        <Link
          href="/"
          className="text-sm font-bold text-[var(--color-accent)] mr-4 shrink-0"
        >
          Explore Parks
        </Link>
        <div className="flex-1" />
        {NAV_LINKS.map(({ label, href }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors ${
                active
                  ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)] font-medium"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
