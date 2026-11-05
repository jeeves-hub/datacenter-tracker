// Cleanview-equivalent data sources — all public records, all free.
//
// Cleanview says: "Our analysts research each project from permits, utility
// filings and SEC documents, then check it against satellite images."
//
// We replicate the same pipeline from free public sources:
//
// 1. AIR PERMITS — State air quality agencies
//    Every data center needs backup diesel generators, which require air permits.
//    These list MW capacity, generator count, and location.
//    - Texas: TCEQ permitting
//    - Virginia: DEQ air permits
//    - Georgia: EPD air permits
//    - Ohio: EPA Ohio air permits
//    - Arizona: ADEQ / Maricopa County
//    - North Carolina: DAQ
//    - Indiana: IDEM
//    - Louisiana: LDEQ
//    - All states: EPA CAMD (Clean Air Markets Division) database
//
// 2. UTILITY INTERCONNECTION QUEUES — ISO/RTO
//    Data centers >50 MW typically need grid interconnection studies.
//    These list project name, MW, location, utility, and queue position.
//    - PJM (Mid-Atlantic/Ohio): pjm.com/planning/services/requests
//    - ERCOT (Texas): ercot.com/gridinfo/resource
//    - MISO (Midwest): misoenergy.org
//    - CAISO (California): caiso.com/planning
//    - SPP (Southwest): spp.org
//    - NYISO (New York): nyiso.com
//    - ISO-NE (New England): iso-ne.com
//
// 3. SEC FILINGS
//    Public companies (AWS, Google, Meta, Microsoft, CoreWeave, etc.) disclose
//    data center investments in 10-K, 10-Q, 8-K filings.
//    - Full-text search: sec.gov/edgar
//    - Targets: "data center", "hyperscale", "AI infrastructure"
//
// 4. BUILDING PERMITS — County/city planning departments
//    Major data center counties have online permit portals:
//    - Loudoun County, VA: loudoun.gov/building-permits
//    - Prince William County, VA
//    - Fairfax County, VA
//    - Maricopa County, AZ
//    - Dallas/Fort Worth area counties
//    - Columbus/Franklin County, OH
//
// 5. ZONING/PLANNING FILINGS — County planning commissions
//    Rezoning applications, special use permits, site plans.
//    - Same counties as building permits
//    - Often posted as board meeting agendas
//
// 6. FREE TRACKER AGGREGATION
//    Combine all free public trackers (deduplicate):
//    - Apollo Technical: 111 projects (100 MW+)
//    - Datacenter Census: ~164 projects
//    - Data Center News: ~43 projects
//    - Electric Choice: 3,525 data centers
//
// 7. SATELLITE VERIFICATION
//    Free satellite imagery (instead of paid Airbus):
//    - Sentinel-2: 10m resolution, free, ESA
//    - Landsat 8/9: 30m resolution, free, USGS/NASA
//    - NAIP: 1m resolution, free, USDA (less frequent)

export type SourceType =
  | "air_permit"
  | "interconnection_queue"
  | "sec_filing"
  | "building_permit"
  | "zoning_filing"
  | "tracker_aggregation"
  | "satellite";

export type SourceStatus = "operational" | "in_development" | "planned";

export type DataSource = {
  id: string;
  type: SourceType;
  name: string;
  url: string;
  coverage: string;
  updateFrequency: string;
  status: SourceStatus;
  notes: string;
};

export const DATA_SOURCES: DataSource[] = [
  // 1. Air permits — state environmental agencies
  {
    id: "tceq-air-permits",
    type: "air_permit",
    name: "Texas Commission on Environmental Quality (TCEQ) — Air Permits",
    url: "https://www.tceq.texas.gov/permitting/air_permits",
    coverage: "Texas — all data center generator permits",
    updateFrequency: "Daily",
    status: "in_development",
    notes: "New Source Review permits for backup generators. Search by 'data center' or 'AI' in permit descriptions.",
  },
  {
    id: "va-deq-air",
    type: "air_permit",
    name: "Virginia DEQ — Air Permits",
    url: "https://deq.virginia.gov/permits-regulations/permits/air",
    coverage: "Virginia — data center generator permits",
    updateFrequency: "Weekly",
    status: "planned",
    notes: "Major facility permits for data center campuses.",
  },
  {
    id: "ga-epd-air",
    type: "air_permit",
    name: "Georgia EPD — Air Quality Permits",
    url: "https://epd.georgia.gov/air-permits",
    coverage: "Georgia — data center generator permits",
    updateFrequency: "Weekly",
    status: "planned",
    notes: "PSD permits for large data center campuses.",
  },
  {
    id: "epa-camd",
    type: "air_permit",
    name: "EPA Clean Air Markets Division (CAMD)",
    url: "https://camd.epa.gov/",
    coverage: "All US states — facility-level emissions data",
    updateFrequency: "Daily",
    status: "planned",
    notes: "Federal database of all major air permit holders. Cross-reference with data center addresses.",
  },

  // 2. Interconnection queues — ISO/RTO
  {
    id: "pjm-queue",
    type: "interconnection_queue",
    name: "PJM Interconnection Queue",
    url: "https://www.pjm.com/planning/services/requests/new-service-requests",
    coverage: "Mid-Atlantic, Ohio, Indiana, Illinois, Virginia, West Virginia",
    updateFrequency: "Daily",
    status: "in_development",
    notes: "Largest US interconnection queue. Data center projects >50 MW appear here with MW, utility, county.",
  },
  {
    id: "ercot-queue",
    type: "interconnection_queue",
    name: "ERCOT Generation Interconnection Queue",
    url: "https://www.ercot.com/gridinfo/resource",
    coverage: "Texas",
    updateFrequency: "Daily",
    status: "planned",
    notes: "Texas interconnection requests. Many GW-scale AI data center projects in ERCOT queue.",
  },
  {
    id: "miso-queue",
    type: "interconnection_queue",
    name: "MISO Interconnection Queue",
    url: "https://www.misoenergy.org/planning/",
    coverage: "Midwest — 15 states",
    updateFrequency: "Weekly",
    status: "planned",
    notes: "Midwest ISO queue. Indiana, Illinois, Michigan, Minnesota projects.",
  },
  {
    id: "caiso-queue",
    type: "interconnection_queue",
    name: "CAISO Interconnection Queue",
    url: "https://www.caiso.com/planning",
    coverage: "California",
    updateFrequency: "Weekly",
    status: "planned",
    notes: "California ISO queue.",
  },
  {
    id: "spp-queue",
    type: "interconnection_queue",
    name: "SPP Interconnection Queue",
    url: "https://www.spp.org/engineering/",
    coverage: "Southwest Power Pool — 14 states",
    updateFrequency: "Weekly",
    status: "planned",
    notes: "Oklahoma, Kansas, Nebraska, North Dakota projects.",
  },
  {
    id: "nyiso-queue",
    type: "interconnection_queue",
    name: "NYISO Interconnection Queue",
    url: "https://www.nyiso.com/planning",
    coverage: "New York",
    updateFrequency: "Weekly",
    status: "planned",
    notes: "New York ISO queue.",
  },

  // 3. SEC filings
  {
    id: "sec-edgar",
    type: "sec_filing",
    name: "SEC EDGAR — Full-Text Search",
    url: "https://www.sec.gov/cgi-bin/srqsb",
    coverage: "All public companies (AWS, Google, Meta, Microsoft, CoreWeave, etc.)",
    updateFrequency: "Daily",
    status: "planned",
    notes: "Search 10-K, 10-Q, 8-K filings for 'data center', 'hyperscale', 'AI infrastructure'. Disclosures include capacity, investment, location.",
  },

  // 4. Building permits — county planning departments
  {
    id: "loudoun-permits",
    type: "building_permit",
    name: "Loudoun County, VA — Building Permits",
    url: "https://www.loudoun.gov/building-permits",
    coverage: "Loudoun County, VA (largest US data center market)",
    updateFrequency: "Daily",
    status: "planned",
    notes: "Online permit portal. Search for data center building permits by type.",
  },
  {
    id: "pwcd-permits",
    type: "building_permit",
    name: "Prince William County, VA — Planning",
    url: "https://www.pwcva.gov/planning",
    coverage: "Prince William County, VA",
    updateFrequency: "Weekly",
    status: "planned",
    notes: "Major data center development area.",
  },
  {
    id: "maricopa-permits",
    type: "building_permit",
    name: "Maricopa County, AZ — Planning & Development",
    url: "https://www.maricopa.gov/2363/Planning-Development",
    coverage: "Maricopa County, AZ (Goodyear, Mesa, Phoenix area)",
    updateFrequency: "Weekly",
    status: "planned",
    notes: "Arizona data center permits.",
  },

  // 5. Free tracker aggregation
  {
    id: "apollo-tracker",
    type: "tracker_aggregation",
    name: "Apollo Technical — US Data Center Map",
    url: "https://www.apollotechnical.com/data-center-map/",
    coverage: "111 active projects, 100 MW+",
    updateFrequency: "Monthly",
    status: "operational",
    notes: "Primary free tracker. Already integrated.",
  },
  {
    id: "datacenter-census",
    type: "tracker_aggregation",
    name: "Datacenter Census",
    url: "https://datacentercensus.com/projects",
    coverage: "~164 major projects, all sizes where disclosed",
    updateFrequency: "Weekly",
    status: "operational",
    notes: "Projects down to 10 MW. Already partially integrated.",
  },
  {
    id: "dcn-tracker",
    type: "tracker_aggregation",
    name: "Data Center News — Project Tracker",
    url: "https://datacenternews.org/data-center-projects/",
    coverage: "~43 major projects with primary source links",
    updateFrequency: "Monthly",
    status: "operational",
    notes: "Each project links to primary government source.",
  },
  {
    id: "electric-choice",
    type: "tracker_aggregation",
    name: "Electric Choice — US Data Center Tracker",
    url: "https://www.electricchoice.com/datacenters/",
    coverage: "3,525 data centers across all 50 states",
    updateFrequency: "Monthly",
    status: "planned",
    notes: "Broadest free tracker. Includes many smaller facilities.",
  },

  // 6. Satellite verification
  {
    id: "sentinel-2",
    type: "satellite",
    name: "ESA Sentinel-2 (free satellite imagery)",
    url: "https://sentinel.esa.int/web/sentinel/missions/sentinel-2",
    coverage: "Global, 10m resolution, every 5 days",
    updateFrequency: "Every 5 days",
    status: "planned",
    notes: "Free alternative to paid Airbus imagery. Can verify construction status at known coordinates.",
  },
  {
    id: "landsat",
    type: "satellite",
    name: "USGS/NASA Landsat 8/9",
    url: "https://www.usgs.gov/landsat-missions",
    coverage: "Global, 30m resolution, every 16 days",
    updateFrequency: "Every 16 days",
    status: "planned",
    notes: "Free, long-running satellite program. Lower resolution than Sentinel-2 but longer historical record.",
  },
];