"use client";

import { useMemo, useState } from "react";
import type { Project, Stage } from "@/lib/types";
import { STAGES, STAGE_MAP } from "@/lib/types";
import { formatGW } from "@/lib/stats";
import { MapView } from "@/components/MapView";

type Props = {
  projects: Project[];
  lastUpdated: string;
};

export function Dashboard({ projects, lastUpdated }: Props) {
  const [stageFilter, setStageFilter] = useState<Stage | "all">("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "map">("table");

  const states = useMemo(() => {
    const set = new Set(projects.map((p) => p.location.state));
    return [...set].sort();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (stageFilter !== "all" && p.stage !== stageFilter) return false;
      if (stateFilter !== "all" && p.location.state !== stateFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = [
          p.name, p.developer, p.offtaker ?? "", p.operator ?? "",
          p.location.city, p.location.state,
        ].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [projects, stageFilter, stateFilter, search]);

  const totals = useMemo(() => {
    const byStage = new Map<Stage, { count: number; mw: number }>();
    for (const s of STAGES) byStage.set(s.id, { count: 0, mw: 0 });
    for (const p of projects) {
      const e = byStage.get(p.stage)!;
      e.count += 1;
      e.mw += p.capacityMW;
    }
    return byStage;
  }, [projects]);

  const totalGW = filtered.reduce((a, p) => a + p.capacityMW, 0);
  const totalOpsMW = filtered.reduce((a, p) => a + (p.statusMW ?? 0), 0);
  const selectedProject = selected ? filtered.find((p) => p.id === selected) ?? null : null;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            US Data Center Project Tracker
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {filtered.length} projects · {formatGW(totalGW)} planned ·{" "}
            {formatGW(totalOpsMW)} operational · Updated {lastUpdated}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Daily refresh enabled
        </div>
      </header>

      {/* Stage summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STAGES.map((s) => {
          const data = totals.get(s.id)!;
          const active = stageFilter === s.id;
          return (
            <button
              key={s.id}
              onClick={() => {
                setStageFilter(active ? "all" : s.id);
                setViewMode("map");
              }}
              className={`group rounded-lg border p-4 text-left transition-all ${
                active ? "border-transparent" : "border-gray-800 hover:border-gray-600"
              }`}
              style={active ? { boxShadow: `0 0 0 2px ${s.color}` } : undefined}
            >
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full" style={{ background: s.color }} />
                <span className="text-xs font-medium text-gray-300">{s.label}</span>
              </div>
              <div className="mt-2 text-xl font-bold text-white">
                {data.count === 0 ? "—" : formatGW(data.mw)}
              </div>
              <div className="text-xs text-gray-500">
                {data.count === 0 ? "No projects" : `${data.count} projects`}
              </div>
            </button>
          );
        })}
      </div>

      {/* View toggle + Controls */}
      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-lg border border-gray-800 p-1">
          <button
            onClick={() => setViewMode("table")}
            className={`rounded-md px-3 py-1 text-sm ${
              viewMode === "table" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-gray-200"
            }`}
          >Table</button>
          <button
            onClick={() => setViewMode("map")}
            className={`rounded-md px-3 py-1 text-sm ${
              viewMode === "map" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-gray-200"
            }`}
          >Map</button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search projects, developers, offtakers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full flex-1 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-gray-600 focus:outline-none"
        />
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-200 focus:outline-none"
        >
          <option value="all">All States</option>
          {states.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value as Stage | "all")}
          className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-200 focus:outline-none"
        >
          <option value="all">All Stages</option>
          {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        {(stageFilter !== "all" || stateFilter !== "all" || search) && (
          <button
            onClick={() => { setStageFilter("all"); setStateFilter("all"); setSearch(""); }}
            className="rounded-lg border border-gray-800 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:border-gray-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table + detail panel (or Map) */}
      {viewMode === "map" ? (
        <MapView projects={filtered} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
          <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-gray-900/50 text-xs uppercase tracking-wide text-gray-400">
              <tr>
                <th className="px-3 py-3 text-left font-medium">Project</th>
                <th className="px-3 py-3 text-left font-medium">Location</th>
                <th className="px-3 py-3 text-left font-medium">Developer</th>
                <th className="px-3 py-3 text-left font-medium">Offtaker</th>
                <th className="px-3 py-3 text-right font-medium">Capacity</th>
                <th className="px-3 py-3 text-center font-medium">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filtered.map((p) => {
                const stage = STAGE_MAP[p.stage];
                const isSel = selected === p.id;
                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelected(isSel ? null : p.id)}
                    className={`cursor-pointer transition-colors ${
                      isSel ? "bg-gray-900/60" : "hover:bg-gray-900/30"
                    }`}
                  >
                    <td className="px-3 py-3">
                      <div className="font-medium text-gray-100">{p.name}</div>
                      {p.investment && (
                        <div className="text-xs text-gray-500">{p.investment}</div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-gray-300 whitespace-nowrap">
                      {p.location.city}, {p.location.state}
                    </td>
                    <td className="px-3 py-3 text-gray-300">{p.developer}</td>
                    <td className="px-3 py-3 text-gray-300">{p.offtaker ?? "—"}</td>
                    <td className="px-3 py-3 text-right font-mono text-gray-100 whitespace-nowrap">
                      {formatGW(p.capacityMW)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full" style={{ background: stage.color }} />
                        <span className="text-xs text-gray-300 hidden sm:inline">{stage.label}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="px-4 py-12 text-center text-gray-500">
              No projects match these filters.
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedProject && (
          <ProjectDetail project={selectedProject} onClose={() => setSelected(null)} />
        )}
        </div>
      )}
    </div>
  );
}

function ProjectDetail({ project: p, onClose }: { project: Project; onClose: () => void }) {
  const stage = STAGE_MAP[p.stage];
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4 h-fit sticky top-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">{p.name}</h2>
          <p className="text-xs text-gray-500">{p.location.city}, {p.location.state}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xl leading-none">×</button>
      </div>

      <span
        className="inline-block rounded-full px-2 py-0.5 text-xs font-medium mb-4"
        style={{ background: `${stage.color}1a`, color: stage.color, border: `1px solid ${stage.color}40` }}
      >
        {stage.label}
      </span>

      <div className="space-y-2 text-sm">
        <Row label="Capacity" value={formatGW(p.capacityMW)} />
        {p.statusMW ? <Row label="Operational" value={formatGW(p.statusMW)} /> : null}
        <Row label="Developer" value={p.developer} />
        {p.offtaker && <Row label="Offtaker" value={p.offtaker} />}
        {p.operator && <Row label="Operator" value={p.operator} />}
        {p.powerCompany && <Row label="Utility" value={p.powerCompany} />}
        {p.expectedOnline && <Row label="Expected Online" value={p.expectedOnline} />}
        {p.announcedDate && <Row label="Announced" value={p.announcedDate} />}
        {p.investment && <Row label="Investment" value={p.investment} />}
      </div>

      {p.parties.length > 0 && (
        <div className="mt-4 border-t border-gray-800 pt-3">
          <h3 className="text-xs font-medium text-gray-400 mb-2">Key Parties</h3>
          <div className="flex flex-wrap gap-1">
            {p.parties.map((party, i) => (
              <span key={i} className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-400">
                <span className="text-gray-500">{party.role}:</span> {party.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {p.notes && (
        <p className="mt-4 text-xs text-gray-500 leading-relaxed">{p.notes}</p>
      )}

      {p.sources.length > 0 && (
        <div className="mt-4 border-t border-gray-800 pt-3">
          <h3 className="text-xs font-medium text-gray-400 mb-2">Sources</h3>
          <ul className="space-y-1">
            {p.sources.map((s, i) => (
              <li key={i}>
                <a
                  href={s}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500/70 hover:text-blue-400 break-all"
                >
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-200 text-right">{value}</span>
    </div>
  );
}