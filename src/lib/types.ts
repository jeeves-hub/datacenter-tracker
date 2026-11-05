export type Stage =
  | "concept"
  | "permits_pending"
  | "approved"
  | "under_construction"
  | "operational"
  | "rejected";

export type StageInfo = {
  id: Stage;
  label: string;
  color: string;
  description: string;
};

export const STAGES: StageInfo[] = [
  { id: "concept", label: "Concept", color: "#6366f1", description: "Announced or in early planning. No permits filed yet." },
  { id: "permits_pending", label: "Permits Pending", color: "#f59e0b", description: "Permit applications filed with utility, zoning, or environmental regulators." },
  { id: "approved", label: "Approved", color: "#10b981", description: "Permits granted. Pre-construction or site preparation." },
  { id: "under_construction", label: "Under Construction", color: "#3b82f6", description: "Active build-out — structural, power, or fit-out phase." },
  { id: "operational", label: "Operational", color: "#22c55e", description: "Live and serving compute load." },
  { id: "rejected", label: "Rejected / Cancelled", color: "#ef4444", description: "Permits denied, project withdrawn, or cancelled." },
];

export const STAGE_MAP: Record<Stage, StageInfo> = Object.fromEntries(
  STAGES.map((s) => [s.id, s]),
) as Record<Stage, StageInfo>;

export type Party = {
  role: string;
  name: string;
};

export type Project = {
  id: string;
  name: string;
  developer: string;
  offtaker?: string;
  operator?: string;
  powerCompany?: string;
  location: {
    city: string;
    state: string;
    region?: string;
  };
  capacityMW: number; // planned total
  statusMW?: number; // capacity currently online (for operational phases)
  stage: Stage;
  announcedDate?: string;
  expectedOnline?: string;
  investment?: string; // $ amount
  parties: Party[];
  notes?: string;
  sources: string[];
  lastUpdated: string;
};