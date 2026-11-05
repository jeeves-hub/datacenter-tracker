import { PROJECTS } from "./projects";
import type { Project, Stage } from "./types";

export function getAllProjects(): Project[] {
  return PROJECTS;
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
  const map = new Map<Stage, StageSummary>();

  for (const p of PROJECTS) {
    const existing = map.get(p.stage) ?? {
      stage: p.stage,
      label: p.stage,
      color: "",
      count: 0,
      totalMW: 0,
      operationalMW: 0,
    };

    existing.count += 1;
    existing.totalMW += p.capacityMW;
    existing.operationalMW += p.statusMW ?? 0;
    map.set(p.stage, existing);
  }

  return map;
}

export type DeveloperSummary = {
  developer: string;
  count: number;
  totalMW: number;
};

export function getDeveloperSummaries(): DeveloperSummary[] {
  const map = new Map<string, DeveloperSummary>();
  for (const p of PROJECTS) {
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
  const map = new Map<string, StateSummary>();
  for (const p of PROJECTS) {
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
  const dates = PROJECTS.map((p) => p.lastUpdated).sort().reverse();
  return dates[0] ?? new Date().toISOString().slice(0, 10);
}

export function getTotalCapacityMW(): number {
  return PROJECTS.reduce((acc, p) => acc + p.capacityMW, 0);
}

export function getOperationalMW(): number {
  return PROJECTS.reduce((acc, p) => acc + (p.statusMW ?? 0), 0);
}