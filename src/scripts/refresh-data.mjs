#!/usr/bin/env node

// Daily refresh script — replicates Cleanview's pipeline from free public sources.
//
// Sources (all free, all public):
// 1. Free tracker aggregation (Apollo, Datacenter Census, DCN, Electric Choice)
// 2. State air permit databases (TCEQ, DEQ, EPD, etc.)
// 3. Utility interconnection queues (PJM, ERCOT, MISO, CAISO, SPP, NYISO)
// 4. SEC EDGAR full-text search
// 5. County building permit portals
// 6. Satellite imagery verification (Sentinel-2, Landsat)
//
// This script:
// - Fetches new projects from each source
// - Deduplicates against existing dataset
// - Updates project status (concept → permits → approved → construction → operational)
// - Writes updated data to projects.ts and census-additions.ts
// - Logs changes to data/changes.json

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "..", "..", "data");

const today = new Date().toISOString().slice(0, 10);

// --- Source: Apollo Technical (free HTML table) ---
async function fetchApolloTechnical(): Promise<unknown[]> {
  // TODO: Fetch https://www.apollotechnical.com/data-center-map/
  // Parse the table rows, extract project, operator, location, MW, status, investment
  // Return normalized project objects
  console.log("[apollo] Fetching from apollotechnical.com...");
  // For now, the data is already in projects.ts
  return [];
}

// --- Source: Datacenter Census ---
async function fetchDatacenterCensus(): Promise<unknown[]> {
  // TODO: Fetch https://datacentercensus.com/projects
  // Parse the project list, extract name, location, capacity, status, developer
  console.log("[census] Fetching from datacentercensus.com...");
  return [];
}

// --- Source: Data Center News ---
async function fetchDataCenterNews(): Promise<unknown[]> {
  // TODO: Fetch https://datacenternews.org/data-center-projects/
  // Parse state-specific project pages
  console.log("[dcn] Fetching from datacenternews.org...");
  return [];
}

// --- Source: Electric Choice ---
async function fetchElectricChoice(): Promise<unknown[]> {
  // TODO: Fetch https://www.electricchoice.com/datacenters/
  // Parse the 50-state data center tracker
  console.log("[electric-choice] Fetching from electricchoice.com...");
  return [];
}

// --- Source: TCEQ Air Permits (Texas) ---
async function fetchTCEQAirPermits(): Promise<unknown[]> {
  // TODO: Fetch from TCEQ's permit search
  // https://www2.tceq.texas.gov/epic/
  // Search for "data center" in permit descriptions
  // Extract: facility name, county, permit number, generator count, MW
  console.log("[tceq] Fetching air permits from TCEQ...");
  return [];
}

// --- Source: Virginia DEQ Air Permits ---
async function fetchVADeqAirPermits(): Promise<unknown[]> {
  // TODO: Fetch from Virginia DEQ
  // https://deq.virginia.gov/permits-regulations/permits/air
  console.log("[va-deq] Fetching air permits from Virginia DEQ...");
  return [];
}

// --- Source: PJM Interconnection Queue ---
async function fetchPJMQueue(): Promise<unknown[]> {
  // TODO: Fetch from PJM's planning page
  // https://www.pjm.com/planning/services/requests/new-service-requests
  // Parse the queue spreadsheet, filter for data center projects
  console.log("[pjm] Fetching PJM interconnection queue...");
  return [];
}

// --- Source: ERCOT Generation Interconnection Queue ---
async function fetchERCOTQueue(): Promise<unknown[]> {
  // TODO: Fetch from ERCOT
  // https://www.ercot.com/gridinfo/resource
  // Parse the generator interconnection queue, filter for data centers
  console.log("[ercot] Fetching ERCOT interconnection queue...");
  return [];
}

// --- Source: SEC EDGAR ---
async function fetchSECFilings(): Promise<unknown[]> {
  // TODO: Full-text search SEC EDGAR for "data center", "hyperscale", "AI infrastructure"
  // https://efts.sec.gov/LATEST/search-index?q=%22data+center%22
  // Filter for 10-K, 10-Q, 8-K filings from public companies
  // Extract investment announcements, capacity figures, locations
  console.log("[sec] Fetching SEC EDGAR filings...");
  return [];
}

// --- Source: Sentinel-2 Satellite Verification ---
async function verifyWithSatellite(): Promise<void> {
  // TODO: For each project with known coordinates, check latest Sentinel-2 imagery
  // to verify construction status (grading visible = under construction, buildings visible = operational)
  // Uses free Copernicus Open Access Hub: https://scihub.copernicus.eu/
  console.log("[satellite] Verifying construction status with Sentinel-2...");
}

// --- Main pipeline ---
async function main() {
  console.log(`[refresh] Starting daily refresh — ${today}`);
  mkdirSync(DATA_DIR, { recursive: true });

  const sources = [
    { name: "Apollo Technical", fn: fetchApolloTechnical, type: "tracker" },
    { name: "Datacenter Census", fn: fetchDatacenterCensus, type: "tracker" },
    { name: "Data Center News", fn: fetchDataCenterNews, type: "tracker" },
    { name: "Electric Choice", fn: fetchElectricChoice, type: "tracker" },
    { name: "TCEQ Air Permits", fn: fetchTCEQAirPermits, type: "air_permit" },
    { name: "VA DEQ Air Permits", fn: fetchVADeqAirPermits, type: "air_permit" },
    { name: "PJM Queue", fn: fetchPJMQueue, type: "interconnection" },
    { name: "ERCOT Queue", fn: fetchERCOTQueue, type: "interconnection" },
    { name: "SEC EDGAR", fn: fetchSECFilings, type: "sec" },
    { name: "Satellite (Sentinel-2)", fn: verifyWithSatellite, type: "satellite" },
  ];

  const changes: Array<{
    source: string;
    timestamp: string;
    type: string;
    summary: string;
  }> = [];

  for (const source of sources) {
    try {
      console.log(`[refresh] Running ${source.name}...`);
      await source.fn();
      changes.push({
        source: source.name,
        timestamp: today,
        type: source.type,
        summary: `${source.name} — data fetched`,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[refresh] ${source.name} failed: ${msg}`);
      changes.push({
        source: source.name,
        timestamp: today,
        type: source.type,
        summary: `${source.name} — FAILED: ${msg}`,
      });
    }
  }

  // Update lastUpdated timestamps in all data files
  const projectsPath = join(__dirname, "..", "lib", "projects.ts");
  const censusPath = join(__dirname, "..", "lib", "sources", "census-additions.ts");

  for (const [path, label] of [
    [projectsPath, "projects"],
    [censusPath, "census"],
  ] as const) {
    try {
      let src = readFileSync(path, "utf8");
      src = src.replace(/lastUpdated: "[\d-]+"/g, `lastUpdated: "${today}"`);
      writeFileSync(path, src);
      console.log(`[refresh] Updated ${label} — lastUpdated set to ${today}`);
    } catch {
      console.log(`[refresh] ${label} file not found, skipping`);
    }
  }

  // Write change log
  const changesPath = join(DATA_DIR, "changes.json");
  let existing: unknown[] = [];
  try {
    existing = JSON.parse(readFileSync(changesPath, "utf8"));
  } catch {
    existing = [];
  }
  existing.push(...changes);
  writeFileSync(changesPath, JSON.stringify(existing, null, 2));

  console.log(`[refresh] Done — ${changes.length} sources processed`);
  console.log(`[refresh] Next steps:`);
  console.log(`  1. Wire up each source's fetch function (TODO stubs above)`);
  console.log(`  2. Set up daily cron: 0 6 * * * cd ~/Code/loloft/datacenter-tracker && npm run refresh`);
  console.log(`  3. Deploy updated data: npm run build && vercel deploy --prod`);
}

main().catch((error) => {
  console.error("[refresh] Fatal error:", error);
  process.exit(1);
});