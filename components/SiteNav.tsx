"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "All Parks", href: "/parks" },
  { label: "Explore", href: "/map" },
  { label: "Activities", href: "/activities" },
  { label: "Alerts", href: "/alerts" },
  { label: "Newsroom", href: "/newsroom" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 bg-[var(--color-bg)]/90 backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-12">
        <Link
          href="/"
          className="text-sm font-bold text-[var(--color-accent)] mr-4 shrink-0"
        >
          Explore Parks
        </Link>
        <div className="flex-1" />

        {/* Desktop nav */}
        <div className="hidden sm:flex gap-1">
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

        {/* Hamburger button */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-white/5 bg-[var(--color-bg)]/95 backdrop-blur">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
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
        </div>
      )}
    </nav>
  );
}
