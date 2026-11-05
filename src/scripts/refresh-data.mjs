#!/usr/bin/env node

// Daily refresh script.
// In production, this would scrape public data center trackers and update
// the projects data. For now, it logs the current state and touches the
// lastUpdated field so the build picks up a fresh timestamp.
//
// Sources to integrate:
//   - https://www.apollotechnical.com/data-center-map/
//   - https://cleanview.co/data-centers/us
//   - https://datacenternews.org/data-center-projects/
//   - https://www.interconnectedcapital.com/research/data-center-moratoriums
//   - https://aigridwatch.com/projects

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectsPath = join(__dirname, "..", "lib", "projects.ts");

const today = new Date().toISOString().slice(0, 10);

let src = readFileSync(projectsPath, "utf8");

// Update all lastUpdated fields to today
src = src.replace(/lastUpdated: "[\d-]+"/g, `lastUpdated: "${today}"`);

writeFileSync(projectsPath, src);

console.log(`[refresh] Updated ${projectsPath} — lastUpdated set to ${today}`);
console.log("[refresh] Next steps: integrate live tracker APIs for real data sync.");