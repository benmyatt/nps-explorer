// Maps park designation to a color theme
// Each returns [text color, bg color] for badges

const DESIGNATION_COLORS: Record<string, [string, string]> = {
  // Green — National Parks
  "National Park": ["text-emerald-400", "bg-emerald-400/10"],
  "National Park & Preserve": ["text-emerald-400", "bg-emerald-400/10"],
  "National Parks": ["text-emerald-400", "bg-emerald-400/10"],
  "National and State Parks": ["text-emerald-400", "bg-emerald-400/10"],

  // Amber — Monuments
  "National Monument": ["text-amber-400", "bg-amber-400/10"],
  "National Monument & Preserve": ["text-amber-400", "bg-amber-400/10"],
  "National Monument and Historic Shrine": ["text-amber-400", "bg-amber-400/10"],

  // Purple — Historic Sites & Parks
  "National Historic Site": ["text-purple-400", "bg-purple-400/10"],
  "National Historical Park": ["text-purple-400", "bg-purple-400/10"],
  "National Historical Park and Preserve": ["text-purple-400", "bg-purple-400/10"],
  "National Historical Park and Ecological Preserve": ["text-purple-400", "bg-purple-400/10"],
  "National Historical Reserve": ["text-purple-400", "bg-purple-400/10"],
  "National Historic Area": ["text-purple-400", "bg-purple-400/10"],
  "International Historic Site": ["text-purple-400", "bg-purple-400/10"],

  // Rose — Memorials & Battlefields
  "National Memorial": ["text-rose-400", "bg-rose-400/10"],
  "Memorial": ["text-rose-400", "bg-rose-400/10"],
  "Memorial Parkway": ["text-rose-400", "bg-rose-400/10"],
  "National Battlefield": ["text-rose-400", "bg-rose-400/10"],
  "National Battlefield Park": ["text-rose-400", "bg-rose-400/10"],
  "National Battlefield Site": ["text-rose-400", "bg-rose-400/10"],
  "National Military Park": ["text-rose-400", "bg-rose-400/10"],

  // Cyan — Water (Seashores, Rivers, Lakeshores)
  "National Seashore": ["text-cyan-400", "bg-cyan-400/10"],
  "National Lakeshore": ["text-cyan-400", "bg-cyan-400/10"],
  "National River": ["text-cyan-400", "bg-cyan-400/10"],
  "National Scenic River": ["text-cyan-400", "bg-cyan-400/10"],
  "National Scenic Riverways": ["text-cyan-400", "bg-cyan-400/10"],
  "National Scenic Riverway": ["text-cyan-400", "bg-cyan-400/10"],
  "National Wild and Scenic River": ["text-cyan-400", "bg-cyan-400/10"],
  "Wild & Scenic River": ["text-cyan-400", "bg-cyan-400/10"],
  "Wild River": ["text-cyan-400", "bg-cyan-400/10"],
  "Scenic & Recreational River": ["text-cyan-400", "bg-cyan-400/10"],
  "National Recreational River": ["text-cyan-400", "bg-cyan-400/10"],
  "National River & Recreation Area": ["text-cyan-400", "bg-cyan-400/10"],

  // Sky — Recreation Areas & Preserves
  "National Recreation Area": ["text-sky-400", "bg-sky-400/10"],
  "National Preserve": ["text-sky-400", "bg-sky-400/10"],
  "National Reserve": ["text-sky-400", "bg-sky-400/10"],
  "Ecological & Historic Preserve": ["text-sky-400", "bg-sky-400/10"],
  "International Park": ["text-sky-400", "bg-sky-400/10"],

  // Orange — Parkways
  "Parkway": ["text-orange-400", "bg-orange-400/10"],
};

const DEFAULT_COLORS: [string, string] = ["text-slate-400", "bg-slate-400/10"];

export function getDesignationColors(designation: string): [string, string] {
  return DESIGNATION_COLORS[designation] ?? DEFAULT_COLORS;
}

// Hex colors for SVG (map dots)
const DESIGNATION_HEX: Record<string, string> = {
  "National Park": "#34d399",
  "National Park & Preserve": "#34d399",
  "National Parks": "#34d399",
  "National and State Parks": "#34d399",
  "National Monument": "#fbbf24",
  "National Monument & Preserve": "#fbbf24",
  "National Monument and Historic Shrine": "#fbbf24",
  "National Historic Site": "#c084fc",
  "National Historical Park": "#c084fc",
  "National Historical Park and Preserve": "#c084fc",
  "National Historical Park and Ecological Preserve": "#c084fc",
  "National Historical Reserve": "#c084fc",
  "National Historic Area": "#c084fc",
  "International Historic Site": "#c084fc",
  "National Memorial": "#fb7185",
  "Memorial": "#fb7185",
  "Memorial Parkway": "#fb7185",
  "National Battlefield": "#fb7185",
  "National Battlefield Park": "#fb7185",
  "National Battlefield Site": "#fb7185",
  "National Military Park": "#fb7185",
  "National Seashore": "#22d3ee",
  "National Lakeshore": "#22d3ee",
  "National River": "#22d3ee",
  "National Scenic River": "#22d3ee",
  "National Scenic Riverways": "#22d3ee",
  "National Scenic Riverway": "#22d3ee",
  "National Wild and Scenic River": "#22d3ee",
  "Wild & Scenic River": "#22d3ee",
  "Wild River": "#22d3ee",
  "Scenic & Recreational River": "#22d3ee",
  "National Recreational River": "#22d3ee",
  "National River & Recreation Area": "#22d3ee",
  "National Recreation Area": "#38bdf8",
  "National Preserve": "#38bdf8",
  "National Reserve": "#38bdf8",
  "Ecological & Historic Preserve": "#38bdf8",
  "International Park": "#38bdf8",
  "Parkway": "#fb923c",
};

const DEFAULT_HEX = "#94a3b8";

export function getDesignationHex(designation: string): string {
  return DESIGNATION_HEX[designation] ?? DEFAULT_HEX;
}

// Map designation to legend filter key
const DESIGNATION_GROUP: Record<string, string> = {
  "National Park": "park",
  "National Park & Preserve": "park",
  "National Parks": "park",
  "National and State Parks": "park",
  "National Monument": "monument",
  "National Monument & Preserve": "monument",
  "National Monument and Historic Shrine": "monument",
  "National Historic Site": "historic",
  "National Historical Park": "historic",
  "National Historical Park and Preserve": "historic",
  "National Historical Park and Ecological Preserve": "historic",
  "National Historical Reserve": "historic",
  "National Historic Area": "historic",
  "International Historic Site": "historic",
  "National Memorial": "memorial",
  "Memorial": "memorial",
  "Memorial Parkway": "memorial",
  "National Battlefield": "memorial",
  "National Battlefield Park": "memorial",
  "National Battlefield Site": "memorial",
  "National Military Park": "memorial",
  "National Seashore": "water",
  "National Lakeshore": "water",
  "National River": "water",
  "National Scenic River": "water",
  "National Scenic Riverways": "water",
  "National Scenic Riverway": "water",
  "National Wild and Scenic River": "water",
  "Wild & Scenic River": "water",
  "Wild River": "water",
  "Scenic & Recreational River": "water",
  "National Recreational River": "water",
  "National River & Recreation Area": "water",
  "National Recreation Area": "recreation",
  "National Preserve": "recreation",
  "National Reserve": "recreation",
  "Ecological & Historic Preserve": "recreation",
  "International Park": "recreation",
  "Parkway": "parkway",
};

export function getDesignationGroup(designation: string): string {
  return DESIGNATION_GROUP[designation] ?? "other";
}
