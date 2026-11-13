import type { Project } from "../types";

const repo = "https://github.com/Gnanasudharsan/dockline-nyc-bikeshare-ops";
const src = (p: string) => `${repo}/blob/main/${p}`;

export const dockline: Project = {
  slug: "dockline",
  name: "Dockline — NYC Bike Share Operations Intelligence",
  short: "Dockline",
  tagline: "Live station availability for ~2,500 NYC bike-share stations: GBFS ingestion, TimescaleDB, dbt under Dagster, certified metrics in Cube, and an LLM that answers only through those metrics.",
  thesis:
    "Define every metric once. Grafana, Power BI, the API, and the language model all read the same certified definitions — so they can't disagree.",
  categories: ["Data Engineering", "Analytics", "AI / Agents"],
  status: "Live",
  period: "Nov 2026",
  year: 2026,
  layout: "pair",
  accent: "teal",
  problem:
    "A station with no bikes turns riders away; one with no free docks strands them. Rebalancing teams need trustworthy, time-weighted availability metrics — and quiet stations that stop reporting make naive averages wrong.",
  built:
    "An ingestion service that polls the public GBFS feed on its own clock with ETag conditional requests; TimescaleDB hypertables and continuous aggregates; dbt models orchestrated by Dagster; a Cube semantic layer feeding Grafana, Power BI and a FastAPI with Server-Sent Events; and “Ask the Data,” where the LLM may only emit a validated query plan.",
  stack: ["Python", "PostgreSQL", "TimescaleDB", "Dagster", "dbt", "Cube", "Grafana", "Power BI", "FastAPI", "SSE", "Next.js", "MapLibre"],
  headline: {
    value: "31 / 32",
    label: "Answerable questions correct, Ask the Data",
    context: "8 / 8 correct refusals · 40-case eval · CI enforces ≥ 85% and 100%",
    kind: "measured",
    source: src("README.md"),
  },
  metrics: [
    { value: "107 + 2", label: "dbt data + unit tests", context: "Stated in README across the model graph", kind: "reported", source: src("README.md") },
    { value: "186", label: "Python tests", context: "Unit + integration against a throwaway TimescaleDB (stated)", kind: "reported", source: src("README.md") },
    { value: "2.7 → 0.95", label: "Full feed downloads per minute", context: "After ETag conditional requests and feed-clock polling", kind: "measured", source: src("docs/blog-post.md") },
    { value: "12 s", label: "Backup restore, 1.49M raw reports", context: "81 MB dump restored with hypertables and aggregates intact", kind: "measured", source: src("docs/blog-post.md") },
    { value: "99–100", label: "Lighthouse, every page", context: "All four categories, mobile and desktop (stated)", kind: "reported", source: src("CHANGELOG.md") },
  ],
  links: {
    github: repo,
    live: "https://dockline-nyc.vercel.app",
    docs: [
      { label: "Decision records (22)", href: `${repo}/tree/main/docs/adr` },
      { label: "Metric catalog", href: src("docs/metrics.md") },
      { label: "Engineering write-up", href: src("docs/blog-post.md") },
    ],
  },
  contribution: "Solo project. The public site runs a serverless snapshot mode computed straight from the live feed; the full stack (warehouse, Dagster, Cube, Grafana, Power BI, Ask the Data, SSE) runs from Docker Compose.",
  architecture: {
    caption: "Cube is the single metrics layer. The LLM never writes SQL — it returns a plan over an allowlisted catalog that code validates.",
    layers: ["Sources", "Ingest", "Warehouse", "Model", "Metrics", "Serve"],
    nodes: [
      { id: "gbfs", label: "GBFS feed", detail: "~60 s cadence", layer: 0, tone: "source" },
      { id: "wx", label: "Open-Meteo", detail: "Hourly weather", layer: 0, tone: "source" },
      { id: "ing", label: "Ingestion", detail: "ETag · feed-clock polling", layer: 1, tone: "process" },
      { id: "ts", label: "TimescaleDB", detail: "Hypertable + aggregates", layer: 2, tone: "store" },
      { id: "dag", label: "Dagster", detail: "5-min · hourly · daily", layer: 3, tone: "process" },
      { id: "dbt", label: "dbt", detail: "Staging → marts → bi", layer: 3, tone: "process" },
      { id: "cube", label: "Cube", detail: "Certified metrics", layer: 4, tone: "guard" },
      { id: "graf", label: "Grafana", detail: "Dashboards + alerts", layer: 5, tone: "serve" },
      { id: "api", label: "FastAPI", detail: "KPIs · SSE · /v1/ask", layer: 5, tone: "serve" },
      { id: "pbi", label: "Power BI", detail: "DirectQuery, borough RLS", layer: 5, tone: "serve" },
    ],
    edges: [
      { from: "gbfs", to: "ing" },
      { from: "wx", to: "ing" },
      { from: "ing", to: "ts" },
      { from: "ts", to: "dag" },
      { from: "dag", to: "dbt" },
      { from: "dbt", to: "cube" },
      { from: "cube", to: "graf" },
      { from: "cube", to: "api" },
      { from: "dbt", to: "pbi" },
    ],
  },
  decisions: [
    { title: "Poll on the feed's clock", body: "Polls are scheduled from the feed's last_updated + ttl rather than a fixed 60 s timer, which had phase-locked just before each refresh." },
    { title: "Carried-forward station grid", body: "A station × 5-minute grid carries values forward so time-weighted metrics stay correct when quiet stations don't report; 30 minutes of silence counts as offline." },
    { title: "One metrics layer, tested", body: "Grafana queries Cube's Postgres-wire SQL API, and Power BI measures mirror Cube names — enforced by tests so definitions can't drift." },
    { title: "The LLM can only plan", body: "Ask the Data returns a JSON plan over an allowlisted catalog; code builds the Cube query, and any number in the answer that isn't in the returned rows is rejected." },
    { title: "$0 public deployment with parity tests", body: "Snapshot mode serves live KPIs from a serverless function; the Python and TypeScript metric implementations are parity-tested on the same recorded feed." },
  ],
  sections: [],
  reliability: [
    "Static checks: Ruff, strict mypy, SQLFluff, ESLint, strict TypeScript, gitleaks.",
    "Ask the Data's known miss (“How does rain affect availability?”) is kept in the report rather than removed from the eval set.",
    "Uptime workflow checks the public site every 15 minutes.",
  ],
  charts: [
    {
      title: "Full GBFS downloads per minute",
      subtitle: "Before vs after ETag conditional requests",
      unit: "",
      better: "lower",
      bars: [
        { label: "Fixed 60 s timer", value: 2.7 },
        { label: "Feed clock + ETag", value: 0.95, highlight: true },
      ],
      source: src("docs/blog-post.md"),
    },
  ],
  lessons: [
    "Time-weighted metrics are a data-modeling problem, not a SQL problem: silence has to mean something explicit.",
    "The first live Ask the Data run scored 84.4% — below its own gate. Shipping the gate first is what made that visible.",
  ],
  caveats: [
    "Independent project — not affiliated with Citi Bike or Lyft; uses only the public feed.",
    "“Demand” is a proxy: there is no trip data, and rebalancing need ignores truck access.",
    "The public demo polls instead of streaming over SSE and does not include Grafana, Power BI or Ask the Data.",
  ],
  visual: {
    src: "/images/dockline/home.png",
    alt: "Dockline live site: a map of NYC bike-share stations colored by imbalance with live KPI tiles for bikes, e-bikes, and empty or full stations.",
    width: 1440,
    height: 900,
    frame: "dockline-nyc.vercel.app",
  },
  roles: { "data-eng": 3, analyst: 3, ai: 1, mlops: 1, "data-sci": 1 },
};
