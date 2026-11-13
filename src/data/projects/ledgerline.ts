import type { Project } from "../types";

const repo = "https://github.com/Gnanasudharsan/financial-txn-etl-fraud-detection";
const src = (p: string) => `${repo}/blob/main/${p}`;

export const ledgerline: Project = {
  slug: "ledgerline",
  name: "Ledgerline — Financial Transaction ETL & Fraud Detection",
  short: "Ledgerline",
  tagline: "A medallion lakehouse that turns 5M simulated card transactions with injected defects into validated Delta tables, fraud scores, and ledger-to-settlement reconciliation.",
  thesis: "Treat the pipeline as the product: quarantine with reason codes, tokenize PII on landing, and evaluate the model once on a month it has never seen.",
  categories: ["Data Engineering", "ML Systems", "MLOps"],
  status: "Case Study",
  period: "Nov 2026",
  year: 2026,
  layout: "wide",
  accent: "teal",
  problem:
    "Raw banking feeds are messy — malformed timestamps, duplicates, bad card numbers — and every downstream number (fraud alerts, reconciliation breaks, finance reports) inherits that mess unless the pipeline rejects it explicitly and auditably.",
  built:
    "PySpark + Delta Lake on an S3-compatible store: bronze landing with HMAC-tokenized card numbers and idempotent appends, silver with schema checks, AES-GCM PII encryption and a 23-expectation Great Expectations suite, point-in-time gold features, a LightGBM fraud model in MLflow, and a reconciliation engine scored against injected ground truth.",
  stack: ["PySpark", "Delta Lake", "Great Expectations", "LightGBM", "MLflow", "SeaweedFS (S3)", "Terraform", "Databricks bundles", "Streamlit", "Power BI"],
  headline: {
    value: "95.2% / 99.3%",
    label: "Fraud recall / precision on a held-out month",
    context: "Simulated data · threshold tuned on May, evaluated once on June",
    kind: "measured",
    source: src("docs/results/model_metrics.json"),
  },
  metrics: [
    { value: "5.04M", label: "Raw transactions processed", context: "Incl. injected defects; 4.91M published to silver, 2.40% quarantined", kind: "measured", source: src("docs/results/pipeline_run.json") },
    { value: "25.1 min", label: "End-to-end pipeline, laptop", context: "Spark local[*], 10 cores, 16 GB", kind: "measured", source: src("docs/results/pipeline_run.json") },
    { value: "0.9974", label: "Fraud PR-AUC, June test month", context: "Simulated fraud is cleaner than real fraud", kind: "measured", source: src("docs/results/model_metrics.json") },
    { value: "99.99996%", label: "Reconciliation accuracy vs injected truth", context: "2 of 4.91M ledger rows misclassified", kind: "measured", source: src("docs/results/recon_metrics.json") },
    { value: "92%", label: "Test coverage in CI", context: "71 tests; transform modules at 98%", kind: "reported", source: src("docs/PROGRESS.md") },
  ],
  links: {
    github: repo,
    live: "https://ledgerline-seven-self.vercel.app",
    docs: [
      { label: "Results", href: src("docs/RESULTS.md") },
      { label: "Decisions", href: src("docs/DECISIONS.md") },
      { label: "Security", href: src("docs/SECURITY.md") },
    ],
  },
  contribution: "Solo project. Runs locally; the Databricks bundle and Terraform are prepared and validated but were not executed against cloud accounts.",
  architecture: {
    caption: "Bad rows never disappear — they are routed to quarantine with reason codes. Raw card numbers never enter Delta history.",
    layers: ["Raw", "Bronze", "Silver", "Gold", "Consume"],
    nodes: [
      { id: "sim", label: "Simulator", detail: "5M txns + defects", layer: 0, tone: "source" },
      { id: "bronze", label: "Bronze Delta", detail: "PAN tokenized on land", layer: 1, tone: "store" },
      { id: "q", label: "Quarantine", detail: "Reason codes", layer: 2, tone: "guard" },
      { id: "silver", label: "Silver Delta", detail: "Schema · GX · AES-GCM", layer: 2, tone: "store" },
      { id: "feat", label: "Gold features", detail: "Point-in-time", layer: 3, tone: "process" },
      { id: "recon", label: "Reconciliation", detail: "Ledger vs settlement", layer: 3, tone: "process" },
      { id: "model", label: "LightGBM + MLflow", detail: "Batch scoring", layer: 4, tone: "model" },
      { id: "marts", label: "Marts", detail: "Streamlit · Power BI", layer: 4, tone: "serve" },
    ],
    edges: [
      { from: "sim", to: "bronze" },
      { from: "bronze", to: "silver" },
      { from: "bronze", to: "q" },
      { from: "silver", to: "feat" },
      { from: "silver", to: "recon" },
      { from: "feat", to: "model" },
      { from: "recon", to: "marts" },
      { from: "model", to: "marts" },
    ],
  },
  decisions: [
    { title: "Tokenize at the door", body: "Card numbers become HMAC-SHA256 tokens at bronze landing, so a raw PAN never enters Delta files or time-travel history." },
    { title: "Idempotent bronze appends", body: "Delta txnAppId / txnVersion close the gap where a crash between data commit and ingest-log commit would double-load a file." },
    { title: "Make the simulation harder", body: "The first simulation gave PR-AUC 0.9994 — too easy. Confounders were added and the full pipeline rerun; the harder v2 numbers are the ones reported." },
  ],
  sections: [],
  reliability: ["23 / 23 expectations pass on the published silver table; quarantined corrupt lines equal injected ones (2,529 = 2,529).", "Strict time split: train Jan–Apr, tune threshold on May, evaluate once on June."],
  lessons: ["If the model looks perfect, the data is probably too easy — fix the data before celebrating the model."],
  caveats: ["All data is simulated.", "Feature importance is concentrated (implied speed ≈ 51% of gain) — a robustness risk on real data.", "Cloud deployment targets were validated, not executed."],
  visual: {
    src: "/images/ledgerline/site.png",
    alt: "Ledgerline case-study site hero: five million transactions, cleaned, scored and reconciled.",
    width: 1440,
    height: 900,
    frame: "ledgerline-seven-self.vercel.app",
  },
  roles: { "data-eng": 3, mlops: 2, ml: 2, analyst: 1, "data-sci": 1 },
};
