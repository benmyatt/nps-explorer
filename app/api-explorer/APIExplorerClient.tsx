"use client";

import { useState } from "react";

interface Field {
  key: string;
  path: string;
  type: string;
  sample: string;
  children: Field[];
}

interface EndpointData {
  name: string;
  path: string;
  desc: string;
  total: string;
  fields: Field[];
}

const TYPE_STYLES: Record<string, string> = {
  string: "bg-[#1a3a2a] text-[var(--color-accent)]",
  number: "bg-[#3a2a1a] text-[#e8a87c]",
  array: "bg-[#1a2a3a] text-[#6ec8e8]",
  object: "bg-[#2a1a3a] text-[#c86ee8]",
  boolean: "bg-[#3a1a1a] text-[#e86e6e]",
  null: "bg-[#2a2a2a] text-[var(--color-text-muted)]",
};

function renderAllRows(fields: Field[], depth = 0): React.ReactNode[] {
  const rows: React.ReactNode[] = [];
  for (const f of fields) {
    rows.push(
      <tr key={f.path} className="hover:bg-white/[0.02]">
        <td className="py-1.5 px-4 border-b border-white/5">
          <span
            className="font-mono text-sm text-[#e8a87c]"
            style={{ paddingLeft: depth * 20 }}
          >
            {depth > 0 ? "└ " : ""}
            {f.key}
          </span>
        </td>
        <td className="py-1.5 px-4 border-b border-white/5">
          <span
            className={`text-xs font-mono px-1.5 py-0.5 rounded ${TYPE_STYLES[f.type] || ""}`}
          >
            {f.type}
          </span>
        </td>
        <td
          className="py-1.5 px-4 border-b border-white/5 text-xs font-mono text-[var(--color-text-muted)] max-w-[400px] truncate"
          title={f.sample}
        >
          {f.sample}
        </td>
      </tr>
    );
    if (f.children.length > 0) {
      rows.push(...renderAllRows(f.children, depth + 1));
    }
  }
  return rows;
}

function EndpointCard({ ep }: { ep: EndpointData }) {
  const [open, setOpen] = useState(false);
  const id = ep.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div id={id} className="bg-[var(--color-surface)] border border-white/5 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-[var(--color-surface-hover)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-[0.65rem] font-bold bg-[var(--color-accent)] text-black px-2 py-0.5 rounded">
            GET
          </span>
          <span className="font-mono text-sm text-[var(--color-accent)]">
            {ep.path}
          </span>
          <span className="text-[0.65rem] bg-[var(--color-accent-dim)]/30 text-[var(--color-accent)] px-2 py-0.5 rounded-full">
            {parseInt(ep.total).toLocaleString()} records
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--color-text-muted)]">
            {ep.fields.length} fields
          </span>
          <span
            className={`text-[var(--color-accent)] transition-transform text-xs ${open ? "rotate-90" : ""}`}
          >
            ▶
          </span>
        </div>
      </button>

      {open && (
        <div className="px-5 py-4 border-t border-white/5">
          <p className="text-sm text-[var(--color-text-muted)] mb-3">{ep.desc}</p>
          {ep.fields.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-[0.65rem] uppercase tracking-wider text-[var(--color-text-muted)] px-4 py-2 border-b border-white/10">
                      Field
                    </th>
                    <th className="text-left text-[0.65rem] uppercase tracking-wider text-[var(--color-text-muted)] px-4 py-2 border-b border-white/10">
                      Type
                    </th>
                    <th className="text-left text-[0.65rem] uppercase tracking-wider text-[var(--color-text-muted)] px-4 py-2 border-b border-white/10">
                      Sample Value
                    </th>
                  </tr>
                </thead>
                <tbody>{renderAllRows(ep.fields)}</tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)]">
              No data available
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function APIExplorerClient({
  endpoints,
}: {
  endpoints: EndpointData[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {endpoints.map((ep) => (
        <EndpointCard key={ep.path} ep={ep} />
      ))}
    </div>
  );
}
