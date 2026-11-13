import type { Project } from "../types";

const repo = "https://github.com/Gnanasudharsan/nyc-congestion-pricing-causal-impact";
const src = (p: string) => `${repo}/blob/main/${p}`;
const site = "https://gnanasudharsan.github.io/nyc-congestion-pricing-causal-impact/";

export const cordon: Project = {
  slug: "cordon",
  name: "Cordon — Measuring the Causal Impact of NYC Congestion Pricing",
  short: "Cordon",
  tagline: "A pre-registered causal study of America's first cordon toll — reporting every estimate, including the ones that don't survive.",
  thesis:
    "The headline result is that no claim passes the study's own robustness bar. Saying so clearly is the contribution.",
  categories: ["Data Science", "Research", "Analytics"],
  status: "Research",
  period: "Nov 2026",
  year: 2026,
  layout: "editorial",
  accent: "amber",
  problem:
    "Did Manhattan's Congestion Relief Zone toll change traffic, transit, air quality, and the neighbourhoods just outside it? The counterfactual is hard: return-to-office mandates, ride-hail pricing, and post-pandemic recovery were all moving at the same time.",
  built:
    "A reproducible pipeline over public MTA, TLC, EPA and NTD data — 223 checksummed source files — with difference-in-differences, event studies, synthetic control, HonestDiD sensitivity bounds, placebo tests and spillover designs, all fixed in a pre-registered analysis plan before any treatment effect was estimated.",
  stack: ["Python", "pyfixest", "statsmodels", "HonestDiD", "Synthetic control", "DuckDB", "Polars", "GeoPandas", "Quarto", "GitHub Actions"],
  headline: {
    value: "0 of 19",
    label: "Claims that pass the pre-registered robustness bar",
    context: "9 fragile · 10 not supported — reported as the result",
    kind: "measured",
    source: src("results/claims.csv"),
  },
  metrics: [
    {
      value: "−10.3%",
      label: "Taxi + ride-hail trips from the zone — fragile",
      context: "95% CI −11.7% to −9.0%; a placebo toll a year earlier also “finds” −7.5%",
      kind: "measured",
      source: src("results/estimates.csv"),
    },
    {
      value: "0 / 10",
      label: "DiD estimates with a robust CI excluding zero",
      context: "HonestDiD relative-magnitudes bound at M̄ = 1",
      kind: "measured",
      source: src("docs/results-phase5.md"),
    },
    {
      value: "+0.3%",
      label: "Crossings at nearby facilities — no displacement detected",
      context: "Randomization inference, 56 assignments, p = 0.80",
      kind: "measured",
      source: src("results/claims.csv"),
    },
    {
      value: "−0.0586",
      label: "Replication of Pandey et al. (published −0.0613)",
      context: "Same design; a cleaner far control gives −0.0987",
      kind: "measured",
      source: src("results/replication_pandey.csv"),
    },
    {
      value: "223",
      label: "Source files with SHA-256 manifests",
      context: "Download time, row count, coverage dates per entry",
      kind: "measured",
      source: src("data/MANIFEST.json"),
    },
    {
      value: "24",
      label: "Logged deviations from the plan",
      context: "Each dated, and marked before or after the related estimate",
      kind: "measured",
      source: src("docs/deviations.md"),
    },
  ],
  links: {
    github: repo,
    live: site,
    paper: `${site}paper.html`,
    docs: [
      { label: "Paper (PDF)", href: `${site}paper.pdf` },
      { label: "All results", href: `${site}results.html` },
      { label: "Pre-registered analysis plan", href: src("docs/analysis-plan.md") },
      { label: "Deviations log", href: src("docs/deviations.md") },
    ],
  },
  contribution: "Solo project — data acquisition, pre-registration, estimation, robustness, and the paper.",
  architecture: {
    caption: "The pre-registration gate sits before geography and estimation. Zone groups are fixed before any outcome is joined.",
    layers: ["Acquire", "Commit", "Construct", "Estimate", "Stress-test", "Publish"],
    nodes: [
      { id: "reg", label: "Dataset registry", detail: "MTA · TLC · EPA · NTD", layer: 0, tone: "source" },
      { id: "ingest", label: "Ingest & audit", detail: "Checksummed manifest", layer: 0, tone: "process" },
      { id: "plan", label: "Pre-registration", detail: "Tagged before estimates", layer: 1, tone: "guard" },
      { id: "geo", label: "Geography", detail: "Zones fixed before outcomes", layer: 2, tone: "process" },
      { id: "panel", label: "Panels + validation", detail: "Fails on any data test", layer: 2, tone: "store" },
      { id: "est", label: "Estimation", detail: "DiD · event study · SC", layer: 3, tone: "model" },
      { id: "rob", label: "Robustness", detail: "HonestDiD · placebos · refuters", layer: 4, tone: "guard" },
      { id: "label", label: "Claim labels", detail: "robust / fragile / unsupported", layer: 4, tone: "process" },
      { id: "paper", label: "Paper + site", detail: "No hand-typed numbers", layer: 5, tone: "serve" },
    ],
    edges: [
      { from: "reg", to: "ingest" },
      { from: "ingest", to: "plan" },
      { from: "plan", to: "geo" },
      { from: "geo", to: "panel" },
      { from: "panel", to: "est" },
      { from: "est", to: "rob" },
      { from: "rob", to: "label" },
      { from: "label", to: "paper" },
    ],
  },
  decisions: [
    {
      title: "The robust bar requires M̄ ≥ 1",
      body: "A claim counts as robust only if its effect survives post-period trend violations as large as the worst pre-period violation (HonestDiD). Pass rules for every check were logged before the checks ran.",
    },
    {
      title: "The intermediate band is never a control",
      body: "Zones 3–8 km from the cordon may absorb spillovers, so the control group starts at 8 km. Re-running a published study's design shows how much this choice matters (−0.0586 vs −0.0987).",
    },
    {
      title: "Only fee-free trips in control units",
      body: "Non-zone trip counts include only trips with both ends outside the cordon, keeping control and spillover units free of the per-trip surcharge.",
    },
    {
      title: "Honest about small clusters",
      body: "With 4–8 clusters, cluster-robust intervals aren't reported as reliable; randomization inference is used instead, and the minimum attainable p-value is stated.",
    },
    {
      title: "Estimators tested on simulated data first",
      body: "Every estimator is checked against simulated data with known effects. Simulation found a seasonal-collinearity flaw in the planned event-study bins before real data was touched.",
    },
  ],
  sections: [
    {
      heading: "What the data can and cannot say",
      body: [
        "Trips from the zone fell about 10% in 2025 relative to distant control zones — but the joint pre-trend test rejects, a placebo toll placed a year earlier produces a similar drop, and the pre-registered detrended specification estimates +1.5%. The finding is labeled fragile.",
        "Transit ridership and air quality estimates are not supported: the synthetic-control fits fail their own checks, and only two usable air monitors exist inside the zone. No displacement into nearby areas was detected.",
      ],
    },
    {
      heading: "Pre-registration, verified by git history",
      body: [
        "The analysis plan was tagged before any estimator touched real data. One amendment — adding a detrended specification — came after descriptives and before any treatment-effect estimate. All 24 deviations are logged with dates.",
      ],
    },
  ],
  reliability: [
    "71 tests, including every estimator on simulated data with known effects.",
    "Fixed-effects estimates cross-checked against pyfixest to machine precision; the HonestDiD port validated against the R package (20 / 20 endpoints).",
    "The paper reads every number from results/ through generated variables — no hand-typed values.",
    "CI: locked environment, lint, strict typing, tests, and a committed-data size check.",
  ],
  findings: [
    { outcome: "Taxi + ride-hail trips from zone", estimate: "−10.3%", interval: "−11.7 to −9.0", verdict: "fragile", point: -10.34, low: -11.68, high: -8.97, note: "Placebo fails; detrended +1.5%" },
    { outcome: "Ride-hail (HVFHV) trips from zone", estimate: "−15.5%", interval: "−17.0 to −14.1", verdict: "fragile", point: -15.54, low: -17.0, high: -14.05 },
    { outcome: "Border-ring trips", estimate: "−4.4%", interval: "−6.1 to −2.6", verdict: "fragile", point: -4.35, low: -6.05, high: -2.63 },
    { outcome: "Tunnel crossings into zone", estimate: "−3.6%", interval: "7 clusters", verdict: "unsupported", point: -3.57, note: "Holm p = 0.143" },
    { outcome: "Upper Manhattan + Bronx trips", estimate: "−2.1%", interval: "−3.4 to −0.7", verdict: "fragile", point: -2.08, low: -3.43, high: -0.7 },
    { outcome: "Spillover-facility crossings", estimate: "+0.3%", interval: "8 clusters", verdict: "null", point: 0.31, note: "No displacement detected" },
    { outcome: "Subway entries, zone stations", estimate: "+0.2%", interval: "−3.5 to +4.1", verdict: "null", point: 0.2, low: -3.52, high: 4.06 },
    { outcome: "Border-ring peak speed", estimate: "+1.3%", interval: "+0.8 to +1.7", verdict: "fragile", point: 1.28, low: 0.82, high: 1.74 },
    { outcome: "Peak speed within zone", estimate: "+2.4%", interval: "+1.9 to +2.9", verdict: "fragile", point: 2.36, low: 1.86, high: 2.85 },
    { outcome: "Zone peak bus speeds", estimate: "+3.5%", interval: "+2.6 to +4.4", verdict: "fragile", point: 3.49, low: 2.63, high: 4.35 },
    { outcome: "Subway ridership (synthetic control)", estimate: "+5.9%", interval: "no interval", verdict: "unsupported", point: 5.92, note: "Holm p = 0.545" },
  ],
  lessons: [
    "Pre-registration is most valuable exactly when the result is disappointing — it is what stops a fragile estimate from being written up as a finding.",
    "Simulate before you estimate. The planned event-study bins would have manufactured fake pre-trends.",
  ],
  caveats: [
    "Public data only: no pre-2025 road-segment speeds, no Port Authority crossings, no open NO₂ monitor inside Manhattan.",
    "Ride-hail declines mix price and congestion effects, because the toll includes a per-trip surcharge.",
    "The equity analysis is associational only.",
  ],
  visual: {
    src: "/images/cordon/event-study-t2.png",
    alt: "Event-study chart for taxi and ride-hail trips from the zone: the pre-registered specification shows a drop after January 2025, while the detrended specification stays near zero.",
    width: 1400,
    height: 720,
    caption: "The two pre-registered specifications disagree — which is why the claim is labeled fragile.",
  },
  gallery: [
    {
      src: "/images/cordon/honestdid.png",
      alt: "HonestDiD sensitivity panel: robust confidence intervals for ten difference-in-differences outcomes widen to include zero as the allowed trend violation grows.",
      width: 1600,
      height: 785,
      caption: "0 of 10 DiD estimates keep a robust 95% CI that excludes zero at M̄ = 1.",
    },
  ],
  roles: { "data-sci": 3, analyst: 2, ml: 1, "data-eng": 1 },
};
