import { PROJECTS } from "./projects";
import { CENSUS_ADDITIONS } from "./sources/census-additions";
import { OPERATING_AI_FACILITIES } from "./sources/operating-ai";
import type { Project, Stage } from "./types";

// Merge all sources and deduplicate by project name similarity.
// Dedup logic: if two projects share the same state and have a similar name
// (or same developer + similar capacity), keep the one with more complete data.

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function nameSimilar(a: string, b: string): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return true;
  if (na.length > 6 && nb.length > 6 && (na.includes(nb) || nb.includes(na))) return true;
  return false;
}

function deduplicate(projects: Project[]): Project[] {
  const seen: Project[] = [];
  for (const p of projects) {
    const existing = seen.find(
      (s) =>
        s.location.state === p.location.state &&
        nameSimilar(s.name, p.name),
    );
    if (existing) {
      // Merge: keep the one with more complete data
      if (
        p.sources.length > existing.sources.length ||
        p.parties.length > existing.parties.length ||
        p.capacityMW > existing.capacityMW
      ) {
        Object.assign(existing, p);
      }
    } else {
      seen.push(p);
    }
  }
  return seen;
}

export function getAllProjects(): Project[] {
  return deduplicate([
    ...PROJECTS,
    ...CENSUS_ADDITIONS,
    ...OPERATING_AI_FACILITIES,
  ]);
}

export type StageSummary = {
  stage: Stage;
  label: string;
  color: string;
  count: number;
  totalMW: number;
  operationalMW: number;
};

export function getStageSummaries(): Map<Stage, StageSummary> {
  const projects = getAllProjects();
  const map = new Map<Stage, StageSummary>();

  for (const s of [
    { stage: "concept" as Stage, label: "Concept", color: "#6366f1" },
    { stage: "permits_pending" as Stage, label: "Permits Pending", color: "#f59e0b" },
    { stage: "approved" as Stage, label: "Approved", color: "#10b981" },
    { stage: "under_construction" as Stage, label: "Under Construction", color: "#3b82f6" },
    { stage: "operational" as Stage, label: "Operational", color: "#22c55e" },
    { stage: "rejected" as Stage, label: "Rejected / Cancelled", color: "#ef4444" },
  ]) {
    map.set(s.stage, {
      ...s,
      count: 0,
      totalMW: 0,
      operationalMW: 0,
    });
  }

  for (const p of projects) {
    const existing = map.get(p.stage)!;
    existing.count += 1;
    existing.totalMW += p.capacityMW;
    existing.operationalMW += p.statusMW ?? 0;
  }

  return map;
}

export type DeveloperSummary = {
  developer: string;
  count: number;
  totalMW: number;
};

export function getDeveloperSummaries(): DeveloperSummary[] {
  const projects = getAllProjects();
  const map = new Map<string, DeveloperSummary>();
  for (const p of projects) {
    const existing = map.get(p.developer) ?? { developer: p.developer, count: 0, totalMW: 0 };
    existing.count += 1;
    existing.totalMW += p.capacityMW;
    map.set(p.developer, existing);
  }
  return [...map.values()].sort((a, b) => b.totalMW - a.totalMW);
}

export type StateSummary = {
  state: string;
  count: number;
  totalMW: number;
};

export function getStateSummaries(): StateSummary[] {
  const projects = getAllProjects();
  const map = new Map<string, StateSummary>();
  for (const p of projects) {
    const existing = map.get(p.location.state) ?? { state: p.location.state, count: 0, totalMW: 0 };
    existing.count += 1;
    existing.totalMW += p.capacityMW;
    map.set(p.location.state, existing);
  }
  return [...map.values()].sort((a, b) => b.totalMW - a.totalMW);
}

export function formatGW(mw: number): string {
  if (mw >= 1000) {
    return `${(mw / 1000).toFixed(2)} GW`;
  }
  return `${mw.toLocaleString()} MW`;
}

export function formatGWShort(mw: number): string {
  if (mw >= 1000) {
    return `${(mw / 1000).toFixed(2)} GW`;
  }
  return `${mw.toLocaleString()} MW`;
}

export function getLastUpdated(): string {
  const projects = getAllProjects();
  const dates = projects.map((p) => p.lastUpdated).sort().reverse();
  return dates[0] ?? new Date().toISOString().slice(0, 10);
}

export function getTotalCapacityMW(): number {
  return getAllProjects().reduce((acc, p) => acc + p.capacityMW, 0);
}

export function getOperationalMW(): number {
  return getAllProjects().reduce((acc, p) => acc + (p.statusMW ?? 0), 0);
}