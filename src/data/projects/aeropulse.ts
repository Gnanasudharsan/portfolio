import type { Project } from "../types";

const repo = "https://github.com/Gnanasudharsan/aeropulse-aviation-intelligence";
const src = (p: string) => `${repo}/blob/main/${p}`;

export const aeropulse: Project = {
  slug: "aeropulse",
  name: "AeroPulse — Real-Time Aviation Intelligence",
  short: "AeroPulse",
  tagline: "Live disruption and weather state for 50 major U.S. airports from official FAA and NOAA feeds, with 24 months of BTS performance analytics in Power BI.",
  thesis:
    "A foggy morning is never presented as a ground stop, and stale data is labeled stale — the product is built around the difference between reported, observed, forecast, and modeled.",
  categories: ["Data Engineering", "Analytics", "Full Stack"],
  status: "Live",
  period: "Nov 2026",
  year: 2026,
  layout: "pair",
  accent: "blue",
  problem:
    "Airport disruption information is scattered across FAA status feeds, METAR observations, TAF forecasts and historical BTS data — each with different formats, cadences and failure modes. Mixing them carelessly produces dashboards that look confident and are wrong.",
  built:
    "Scheduled ingestion of FAA NAS Status (JSON primary, XML fallback) and NOAA Aviation Weather Center METAR/TAF into bronze, silver and gold PostgreSQL layers; a versioned FastAPI; a Next.js command center with a MapLibre airport map; and a separate historical BTS pipeline that feeds a Power BI star schema.",
  stack: ["Python", "FastAPI", "PostgreSQL", "TimescaleDB", "SQLAlchemy", "APScheduler", "DuckDB", "Next.js", "MapLibre", "Power BI", "GitHub Actions"],
  headline: {
    value: "11.0M",
    label: "BTS arrivals modeled for analytics",
    context: "24 months · 78.5% on time · Power BI KPIs reconciled to PostgreSQL",
    kind: "measured",
    source: src("analytics/powerbi/README.md"),
  },
  metrics: [
    { value: "50", label: "Major U.S. airports monitored", context: "Reference table in the API service", kind: "measured", source: src("services/api/app/data/airports.csv") },
    { value: "78.5%", label: "On-time arrival rate", context: "11,024,348 arrivals; 1.58% cancelled; 7.5 min average delay", kind: "measured", source: src("analytics/powerbi/README.md") },
    {
      value: "0.7873",
      label: "Logistic risk model ROC AUC — not served",
      context: "vs 0.7822 rules baseline; failed the +0.02 promotion rule, so rules-v1 stays in production",
      kind: "measured",
      source: src("docs/dashboards/risk-model-report.md"),
    },
    { value: "4 · 33", label: "Power BI pages · visuals", context: "PBIP / TMDL project validated in CI", kind: "measured", source: src("analytics/powerbi/README.md") },
    { value: "5 min", label: "Designed FAA ingestion cadence", context: "Production cron is best-effort; lag is shown as stale, never hidden", kind: "target", source: src("README.md") },
  ],
  links: {
    github: repo,
    live: "https://aeropulse-aviation-intelligence.vercel.app",
    docs: [
      { label: "API docs", href: "https://aeropulse-api-nine.vercel.app/api/docs" },
      { label: "Architecture & ADRs", href: src("docs/architecture/README.md") },
      { label: "Risk model report", href: src("docs/dashboards/risk-model-report.md") },
      { label: "Power BI project", href: `${repo}/tree/main/analytics/powerbi` },
    ],
  },
  contribution: "Solo project — every commit.",
  architecture: {
    caption: "Raw payloads are always retained in bronze. Historical analytics never mix into live counters.",
    layers: ["Sources", "Ingest", "Bronze", "Silver / gold", "Serve"],
    nodes: [
      { id: "faa", label: "FAA NAS Status", detail: "JSON primary · XML fallback", layer: 0, tone: "source" },
      { id: "awc", label: "NOAA AWC", detail: "METAR · TAF", layer: 0, tone: "source" },
      { id: "bts", label: "BTS on-time", detail: "Monthly, 24 months", layer: 0, tone: "source" },
      { id: "jobs", label: "Ingestion jobs", detail: "Advisory-locked ticks", layer: 1, tone: "process" },
      { id: "hist", label: "Historical pipeline", detail: "DuckDB · quality gates", layer: 1, tone: "process" },
      { id: "bronze", label: "Raw payloads", detail: "SHA-256 dedup", layer: 2, tone: "store" },
      { id: "gold", label: "PostgreSQL views", detail: "Status · weather · risk", layer: 3, tone: "store" },
      { id: "parquet", label: "Parquet star schema", detail: "Public extracts", layer: 3, tone: "store" },
      { id: "api", label: "FastAPI /v1", detail: "Freshness endpoint", layer: 4, tone: "serve" },
      { id: "web", label: "Next.js", detail: "MapLibre command center", layer: 4, tone: "serve" },
      { id: "pbi", label: "Power BI", detail: "4 pages, 46 measures", layer: 4, tone: "serve" },
    ],
    edges: [
      { from: "faa", to: "jobs" },
      { from: "awc", to: "jobs" },
      { from: "bts", to: "hist" },
      { from: "jobs", to: "bronze" },
      { from: "bronze", to: "gold" },
      { from: "hist", to: "parquet" },
      { from: "gold", to: "api" },
      { from: "api", to: "web" },
      { from: "parquet", to: "pbi" },
    ],
  },
  decisions: [
    { title: "Evidence-based status colors", body: "Map states come only from reported FAA events and observed METAR flight category, so weather alone never produces a “ground stop.”" },
    { title: "A scheduler, not an orchestrator", body: "Three periodic HTTP jobs and a monthly batch didn't justify Airflow; APScheduler runs locally, and production uses a tick endpoint behind a PostgreSQL advisory lock." },
    { title: "Optional TimescaleDB", body: "Migrations create hypertables only if the extension exists, so the same schema runs on plain managed Postgres." },
    { title: "Models must earn production", body: "The logistic risk model had to beat the rules baseline by 0.02 AUC on a chronological hold-out. It didn't, so only the transparent rules score is served." },
  ],
  sections: [
    {
      heading: "Failure is a first-class state",
      body: [
        "Each run records coverage, stale observations, rejected records, duplicates, unknown stations and fallback-feed use. A failed run never deletes last-good data, and the API exposes per-source freshness so the UI can say exactly how old every value is.",
      ],
    },
  ],
  reliability: [
    "CI: ruff, strict mypy, pytest and pip-audit for the backend; lint, typecheck, Vitest, build and npm audit for the web; Playwright smoke tests; Power BI project validation against Microsoft schemas; gitleaks.",
    "Historical quality gates check that every airport is present, dates fall in the month, and aggregates reconcile.",
  ],
  charts: [
    {
      title: "Disruption risk model, hold-out ROC AUC",
      subtitle: "141,120 airport-hours · Mar–Aug 2026 · promotion rule: +0.02 over baseline",
      unit: "",
      better: "higher",
      bars: [
        { label: "Rules baseline (served)", value: 0.7822, highlight: true },
        { label: "Logistic regression", value: 0.7873, note: "+0.005 — not promoted" },
        { label: "Gradient boosting", value: 0.8113, note: "not served" },
      ],
      source: src("docs/dashboards/risk-model-report.md"),
      footnote: "Risk is a derived indicator, not a per-flight prediction.",
    },
  ],
  lessons: [
    "Say what you don't know. FAA lists only airports with active events — absence means “nothing reported,” not “verified normal,” and the UI says so.",
    "Scheduled cron on a free tier is best-effort; designing for visible staleness was better than pretending to be real time.",
  ],
  caveats: [
    "Not for operational or flight-planning use.",
    "BTS data lags two to three months and covers reporting carriers' domestic flights only.",
    "The Power BI report is published to the service, but public embedding is disabled by the tenant — the site shows dated screenshots.",
  ],
  visual: {
    src: "/images/aeropulse/command-center.png",
    alt: "AeroPulse national command center: KPI tiles above a MapLibre map of U.S. airports colored by reported FAA status and observed flight category.",
    width: 1440,
    height: 1500,
    frame: "aeropulse-aviation-intelligence.vercel.app",
  },
  gallery: [
    {
      src: "/images/aeropulse/powerbi-executive.jpg",
      alt: "Power BI executive performance overview page showing on-time rate, cancellations and average delay for 24 months of BTS data.",
      width: 800,
      height: 600,
      caption: "Power BI executive overview, captured from the Power BI service.",
    },
  ],
  roles: { "data-eng": 3, analyst: 3, ai: 1, ml: 1, "data-sci": 1, mlops: 1 },
};
