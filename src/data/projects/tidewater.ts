import type { Project } from "../types";

const repo = "https://github.com/Gnanasudharsan/tidewater";
const src = (p: string) => `${repo}/blob/main/${p}`;

export const tidewater: Project = {
  slug: "tidewater",
  name: "Tidewater — Exactly-Once CDC Lakehouse",
  short: "Tidewater",
  tagline: "Postgres → Debezium → Kafka → Spark → Delta Lake → dbt, where LSN-ordered idempotent merges turn at-least-once delivery into exactly-once results — proven by chaos tests.",
  thesis: "Exactly-once isn't a delivery guarantee you buy; it's a property of how you write. Prove it by breaking things on purpose.",
  categories: ["Data Engineering", "Research"],
  status: "Research",
  period: "Oct – Nov 2026",
  year: 2026,
  layout: "wide",
  accent: "blue",
  problem:
    "CDC gives fresh data, but Kafka delivers at least once, events arrive out of order, schemas change mid-stream and deletes race updates. Unless every write is idempotent and order-insensitive, the lakehouse is quietly wrong.",
  built:
    "A single-node CDC lakehouse: Debezium on the Postgres WAL into Kafka with a schema registry, Spark Structured Streaming to bronze and silver Delta tables with LSN-guarded MERGE and soft deletes, Change-Data-Feed loading into a Postgres or Snowflake warehouse, dbt marts, Airflow, Prometheus/Grafana and OpenLineage — plus six chaos tests and row-hash reconciliation.",
  stack: ["Debezium", "Kafka", "Spark Structured Streaming", "Delta Lake", "dbt", "Snowflake", "PostgreSQL", "Airflow", "Prometheus", "Grafana", "OpenLineage"],
  headline: {
    value: "6 / 6",
    label: "Chaos tests pass with 0 duplicates and 100% hash reconciliation",
    context: "Six injected-failure scenarios, including a mid-batch kill and a concurrent backfill",
    kind: "measured",
    source: src("results/chaos_local_runs.json"),
  },
  metrics: [
    { value: "100%", label: "Row-hash reconciliation on 4.5M rows", context: "Counts + SHA-256 of every column, silver vs source", kind: "measured", source: src("README.md") },
    { value: "2,000 / s", label: "Source events sustained with 0 Kafka lag", context: "Debezium + bronze keep-up; laptop, one 8 GB Docker VM", kind: "measured", source: src("bench/README.md") },
    { value: "p95 < 60 s", label: "Commit-to-silver latency target", context: "Met on small tables; 80–122 s at ~250k rows/table — reported as missed", kind: "target", source: src("docs/design.md") },
    { value: "~15 min", label: "Recovery from a real Kafka log-loss incident", context: "Debezium re-snapshot, 100% reconciled, postmortem written", kind: "measured", source: src("docs/incidents/2026-11-01-kafka-log-loss.md") },
  ],
  links: {
    github: repo,
    live: "https://gnanasudharsan.github.io/tidewater/",
    docs: [
      { label: "dbt docs & lineage", href: "https://gnanasudharsan.github.io/tidewater/catalog/" },
      { label: "Design", href: src("docs/design.md") },
      { label: "Benchmarks", href: src("bench/README.md") },
    ],
  },
  contribution: "Solo project. Runs on a laptop; a nightly GitHub Actions job runs the real stack and publishes the result.",
  decisions: [
    { title: "Newer-wins MERGE", body: "Silver applies a change only if its (WAL LSN, Kafka offset) is newer than the stored row, so replays are no-ops and order doesn't matter." },
    { title: "Soft deletes", body: "A late update can't resurrect a deleted row, and history stays auditable." },
    { title: "Load by version, not timestamp", body: "The warehouse loads from Delta's Change Data Feed by table version, with upsert and bookmark in one transaction." },
  ],
  sections: [],
  reliability: ["Nightly CI showcase runs the real stack end to end and reconciles every row.", "A JavaScript port of the merge rule is parity-tested against the real PySpark merge."],
  lessons: ["Hashes catch what counts miss: a metadata-only ADD COLUMN with a default emits no CDC for existing rows.", "The benchmark lied before the pipeline did — racing simulators produced wrong numbers until the harness was fixed."],
  caveats: ["Single node, synthetic data; benchmarks are relative, not capacity planning."],
  visual: {
    src: "/images/tidewater/site.png",
    alt: "Tidewater showcase site: pipeline from Postgres through Debezium, Kafka, bronze and silver Delta tables to the warehouse, dbt and Metabase, with the latest verified CI run.",
    width: 1440,
    height: 900,
    frame: "gnanasudharsan.github.io/tidewater",
  },
  roles: { "data-eng": 3, mlops: 1 },
};
