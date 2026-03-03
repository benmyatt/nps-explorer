"use client";

import { useState, useMemo, useCallback } from "react";
import ParkCard from "@/components/ParkCard";
import { STATE_NAMES } from "@/lib/states";
import { getDesignationGroup } from "@/lib/designation-colors";
import { LEGEND_ITEMS } from "@/components/MapLegend";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface ParkItem {
  parkCode: string;
  fullName: string;
  designation: string;
  description: string;
  imageUrl: string | null;
  states: string[];
  activities: string[];
}

interface Props {
  parks: ParkItem[];
  states: string[];
  activities: string[];
  totalCount: number;
  heroImage: string | null;
}

export default function ParksGrid({ parks, states, activities, totalCount, heroImage }: Props) {
  const [query, setQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");

  const filtered = useMemo(() => {
    return parks.filter((p) => {
      if (query && !p.fullName.toLowerCase().includes(query.toLowerCase())) return false;
      if (selectedState && !p.states.includes(selectedState)) return false;
      if (selectedDesignation && getDesignationGroup(p.designation) !== selectedDesignation) return false;
      if (selectedActivity && !p.activities.includes(selectedActivity)) return false;
      return true;
    });
  }, [parks, query, selectedState, selectedDesignation, selectedActivity]);

  const hasFilters = query || selectedState || selectedDesignation || selectedActivity;
  const [hoveredLetter, setHoveredLetter] = useState<string | null>(null);

  const lettersWithParks = useMemo(() => {
    const set = new Set<string>();
    for (const p of filtered) {
      const first = p.fullName[0]?.toUpperCase();
      if (first) set.add(first);
    }
    return set;
  }, [filtered]);

  const scrollToLetter = useCallback((letter: string) => {
    // If this letter has parks, scroll to it. Otherwise find the nearest previous letter that does.
    const idx = ALPHABET.indexOf(letter);
    for (let i = idx; i >= 0; i--) {
      const el = document.getElementById(`park-letter-${ALPHABET[i]}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
  }, []);

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden">
        {heroImage && (
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center 60%" }}
          />
        )}
        <div className="absolute inset-0 bg-[var(--color-bg)]/50" />

        <div className="relative max-w-5xl mx-auto px-6 pt-44 pb-24">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">
            Explore All Parks
          </h1>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative sm:col-span-2">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search parks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--color-bg)]/80 backdrop-blur border border-white/10 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-dim)] text-sm"
              />
            </div>

            {/* State filter */}
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className={`w-full px-4 py-2.5 ${selectedState ? "pr-14" : "pr-9"} rounded-lg bg-[var(--color-bg)]/80 backdrop-blur border border-white/10 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-dim)] appearance-none cursor-pointer`}
              >
                <option value="">All States</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {STATE_NAMES[s] || s}
                  </option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              {selectedState && (
                <button
                  onClick={() => setSelectedState("")}
                  className="absolute right-8 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Designation filter */}
            <div className="relative">
              <select
                value={selectedDesignation}
                onChange={(e) => setSelectedDesignation(e.target.value)}
                className={`w-full px-4 py-2.5 ${selectedDesignation ? "pr-14" : "pr-9"} rounded-lg bg-[var(--color-bg)]/80 backdrop-blur border border-white/10 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-dim)] appearance-none cursor-pointer`}
              >
                <option value="">All Designations</option>
                {LEGEND_ITEMS.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.label}
                  </option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              {selectedDesignation && (
                <button
                  onClick={() => setSelectedDesignation("")}
                  className="absolute right-8 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Activity filter */}
            <div className="relative">
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className={`w-full px-4 py-2.5 ${selectedActivity ? "pr-14" : "pr-9"} rounded-lg bg-[var(--color-bg)]/80 backdrop-blur border border-white/10 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-dim)] appearance-none cursor-pointer`}
              >
                <option value="">All Activities</option>
                {activities.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              {selectedActivity && (
                <button
                  onClick={() => setSelectedActivity("")}
                  className="absolute right-8 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative">
        {/* Active filters */}
        {hasFilters && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-[var(--color-text-muted)]">
              {filtered.length} park{filtered.length !== 1 ? "s" : ""} found
            </p>
            <button
              onClick={() => {
                setQuery("");
                setSelectedState("");
                setSelectedDesignation("");
                setSelectedActivity("");
              }}
              className="text-xs text-[var(--color-accent)] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="text-center py-20 text-[var(--color-text-muted)]">
            No parks match your filters
          </p>
        ) : (
          <div className="flex">
            {/* A-Z sidebar */}
            {!hasFilters && (
              <div
                className="sticky top-20 self-start hidden md:flex flex-col items-center py-2 mr-4 -ml-1 w-8"
                onMouseLeave={() => setHoveredLetter(null)}
              >
                {ALPHABET.map((letter) => {
                  const distance = hoveredLetter
                    ? Math.abs(ALPHABET.indexOf(letter) - ALPHABET.indexOf(hoveredLetter))
                    : -1;
                  const scale =
                    distance === 0 ? 1.6 :
                    distance === 1 ? 1.3 :
                    distance === 2 ? 1.1 : 1;
                  return (
                    <button
                      key={letter}
                      onMouseEnter={() => setHoveredLetter(letter)}
                      onClick={() => scrollToLetter(letter)}
                      className="leading-none py-[3px] px-1 transition-all duration-150 origin-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
                      style={{
                        transform: `scale(${scale})`,
                        fontSize: "11px",
                        fontWeight: distance === 0 ? 600 : 400,
                      }}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Grid */}
            <div className="flex-1 min-w-0">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p, i) => {
                  const firstLetter = p.fullName[0]?.toUpperCase();
                  const isFirstOfLetter =
                    i === 0 || filtered[i - 1].fullName[0]?.toUpperCase() !== firstLetter;
                  return (
                    <div key={p.parkCode} id={isFirstOfLetter ? `park-letter-${firstLetter}` : undefined} className="scroll-mt-24 h-[340px]">
                      <ParkCard
                        parkCode={p.parkCode}
                        name={p.fullName}
                        designation={p.designation}
                        imageUrl={p.imageUrl}
                        description={p.description}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
