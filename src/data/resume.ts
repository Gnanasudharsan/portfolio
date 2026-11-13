import type { RoleId } from "./types";

/**
 * Résumé variants. Skills lines follow the role-specific résumés; project
 * bullets are restricted to verified, repository-backed facts.
 */

export interface ResumeProject {
  slug: string;
  title: string;
  period: string;
  bullets: string[];
}

export interface ResumeVariant {
  id: RoleId | "general";
  label: string;
  file: string;
  summary: string;
  skills: { label: string; items: string }[];
  projects: ResumeProject[];
}

const P: Record<string, ResumeProject> = {
  helio: {
    slug: "helio",
    title: "Helio — Agentic Enterprise Research & Workflow Assistant",
    period: "Oct – Nov 2026",
    bullets: [
      "Built a LangGraph multi-agent assistant that plans before retrieval, answers from permission-aware hybrid search (pgvector + FTS + reranking) and validated read-only SQL, and executes MCP actions only after human approval bound to the exact arguments.",
      "Raised task success from 53% (vector RAG) to 78% on a held-out 32-task benchmark (91% after fixes, disclosed separately); 20/20 prompt-injection attacks defended and 0 unauthorized executions; deployed on GCP Cloud Run + Cloud SQL.",
    ],
  },
  gpu: {
    slug: "gpu-lab",
    title: "GPU Inference Performance Lab",
    period: "Nov 2026",
    bullets: [
      "Built a reproducible small-batch inference benchmarking lab with paired, interleaved trials, bootstrap 95% CIs and a float64 correctness gate across eager PyTorch, torch.compile, fused Metal and Triton kernels, and CUDA graphs.",
      "Measured 1.16–1.26× speedups from fused Metal kernels on Apple M4 (64 → 8 launches) and 1.98× from CUDA graphs on an NVIDIA T4; reported the hand-written Triton kernel's 0.38× slowdown rather than hiding it.",
    ],
  },
  dockline: {
    slug: "dockline",
    title: "Dockline — NYC Bike Share Operations Intelligence",
    period: "Nov 2026",
    bullets: [
      "Built a live GBFS data platform for ~2,500 stations: feed-clock polling with ETag requests (2.7 → 0.95 full downloads/min), TimescaleDB hypertables, dbt models under Dagster, and Cube as the single certified-metrics layer for Grafana, Power BI and FastAPI (SSE).",
      "Shipped “Ask the Data,” an LLM that may only emit a validated query plan over allowlisted metrics: 31/32 answerable questions correct and 8/8 refusals, gated in CI.",
    ],
  },
  aeropulse: {
    slug: "aeropulse",
    title: "AeroPulse — Real-Time Aviation Intelligence",
    period: "Nov 2026",
    bullets: [
      "Built bronze/silver/gold PostgreSQL ingestion of FAA NAS Status and NOAA METAR/TAF for 50 major U.S. airports with a versioned FastAPI and a Next.js MapLibre command center; failed runs never delete last-good data and staleness is surfaced per source.",
      "Modeled 11.0M BTS arrivals (24 months) into a Power BI star schema; kept a rules risk score in production after the logistic model failed a pre-set +0.02 AUC promotion rule.",
    ],
  },
  cordon: {
    slug: "cordon",
    title: "Cordon — Causal Impact of NYC Congestion Pricing",
    period: "Nov 2026",
    bullets: [
      "Pre-registered a causal study of the CRZ toll on public MTA, TLC and EPA data (223 checksummed sources) using difference-in-differences, event studies, synthetic control, HonestDiD bounds and placebo tests.",
      "Reported that 0 of 19 claims pass the pre-registered robustness bar (9 fragile, 10 unsupported) — including a −10.3% trip decline that fails a placebo test — and replicated a published estimate (−0.0586 vs −0.0613).",
    ],
  },
  charlie: {
    slug: "charlie",
    title: "Charlie — Conversational Transit Intelligence (MLOps Expo, 3rd place)",
    period: "Sep – Dec 2025",
    bullets: [
      "Team MLOps system for MBTA delay risk: Airflow ingestion and quality DAGs, DVC-versioned data, MLflow-tracked LightGBM and logistic models with SHAP, Fairlearn bias slices and KS/PSI drift checks.",
      "Built the conversational API service, Next.js frontend, monitoring/retraining modules and GitHub Actions → Cloud Run deployment in my fork.",
    ],
  },
  ledgerline: {
    slug: "ledgerline",
    title: "Ledgerline — Financial Transaction ETL & Fraud Detection",
    period: "Nov 2026",
    bullets: [
      "Built a PySpark + Delta Lake medallion pipeline over 5.04M simulated transactions with PAN tokenization on landing, idempotent appends, reason-coded quarantine and a 23-expectation Great Expectations suite (25.1 min end to end).",
      "Trained a LightGBM fraud model tracked in MLflow — 95.2% recall / 99.3% precision on a held-out month — and a reconciliation engine at 99.99996% accuracy against injected ground truth.",
    ],
  },
  ramp: {
    slug: "ramp",
    title: "Ramp — Agentic Accessibility Auditor",
    period: "Nov 2026",
    bullets: [
      "Built a LangGraph auditor combining axe-core rule checks with schema-validated model checks, verified single-substring fixes and human-approved PRs; F1 0.604 → 0.961 and judgment-issue recall 0 → 1.0 vs an axe-only baseline.",
    ],
  },
  tidewater: {
    slug: "tidewater",
    title: "Tidewater — Exactly-Once CDC Lakehouse",
    period: "Oct – Nov 2026",
    bullets: [
      "Built Postgres → Debezium → Kafka → Spark → Delta Lake → dbt with LSN-guarded idempotent MERGE; 6/6 chaos tests pass with 0 duplicates and 100% row-hash reconciliation on 4.5M rows.",
    ],
  },
};

const base = "Gnanasudharsan_Ashokumar";

export const resumeVariants: ResumeVariant[] = [
  {
    id: "general",
    label: "General",
    file: `${base}_Resume.pdf`,
    summary:
      "AI/ML and data engineer building agentic applications, ML inference and infrastructure, real-time data platforms, and research-backed analytics — with measured, reproducible results.",
    skills: [
      { label: "AI & LLM", items: "RAG, LangGraph, LangChain, MCP, pgvector, hybrid retrieval, reranking, tool calling, structured extraction, LLM evaluation" },
      { label: "Machine learning", items: "PyTorch, scikit-learn, LightGBM, XGBoost, CNNs, SHAP, causal inference, forecasting" },
      { label: "Data", items: "Python, SQL, PySpark, Airflow, Dagster, dbt, Kafka, Delta Lake, PostgreSQL, TimescaleDB, Snowflake" },
      { label: "Platform", items: "FastAPI, Docker, MLflow, DVC, GitHub Actions, AWS, GCP Cloud Run, OAuth 2.0, JWT, TypeScript, Next.js" },
    ],
    projects: [P.helio, P.gpu, { ...P.dockline, bullets: [P.dockline.bullets[0]] }, { ...P.cordon, bullets: [P.cordon.bullets[1]] }],
  },
  {
    id: "ai",
    label: "AI Engineer",
    file: `${base}_AI_Engineer_Resume.pdf`,
    summary: "AI engineer building governed multi-agent and RAG systems with evaluation harnesses, permission boundaries, and human-in-the-loop safety.",
    skills: [
      { label: "AI & LLM", items: "RAG, agentic workflows, LangChain, LangGraph, MCP, embeddings, vector search, pgvector, reranking, structured extraction, tool calling, LLM evaluation, citation verification" },
      { label: "Models", items: "OpenAI / Gemini APIs, Hugging Face Transformers, PyTorch, scikit-learn, LightGBM" },
      { label: "Backend & data", items: "Python, SQL, FastAPI, REST APIs, PostgreSQL, MongoDB, JSON / schema validation" },
      { label: "Cloud & DevOps", items: "AWS, GCP Cloud Run, Docker, Kubernetes, GitHub Actions, CI/CD, OAuth 2.0, JWT" },
    ],
    projects: [P.helio, P.ramp, P.dockline],
  },
  {
    id: "ml",
    label: "ML Engineer",
    file: `${base}_ML_Engineer_Resume.pdf`,
    summary: "ML engineer focused on inference performance, honest benchmarking, and production model pipelines.",
    skills: [
      { label: "Machine learning", items: "PyTorch, TensorFlow, Keras, scikit-learn, LightGBM, XGBoost, CatBoost, CNNs, YOLO, Transformers, SHAP" },
      { label: "ML systems", items: "CUDA graphs, Triton, Metal / MPS, torch.compile, FastAPI, Docker, MLflow, DVC, model serving" },
      { label: "Data & cloud", items: "Pandas, NumPy, OpenCV, Spark, Databricks, PostgreSQL, AWS, GCP" },
      { label: "Engineering", items: "Python, SQL, C/C++, Git, Linux, CI/CD" },
    ],
    projects: [P.gpu, P.charlie, P.ledgerline],
  },
  {
    id: "data-eng",
    label: "Data Engineer",
    file: `${base}_Data_Engineer_Resume.pdf`,
    summary: "Data engineer building batch and streaming pipelines with data contracts, quality gates, and certified metrics.",
    skills: [
      { label: "Data engineering", items: "Python, SQL, PySpark, Spark, Databricks, Airflow, Dagster, dbt, Kafka, Debezium, ETL/ELT, CDC, data quality" },
      { label: "Warehousing", items: "PostgreSQL, TimescaleDB, Delta Lake, Snowflake, BigQuery, Redshift, MySQL, MongoDB, dimensional modeling" },
      { label: "Cloud & DevOps", items: "AWS S3 / SES, GCP, Azure, Docker, Kubernetes, GitHub Actions, IAM / RBAC" },
      { label: "Serving & BI", items: "FastAPI, Cube, Grafana, Power BI" },
    ],
    projects: [P.dockline, P.aeropulse, P.ledgerline, P.tidewater],
  },
  {
    id: "data-sci",
    label: "Data Scientist",
    file: `${base}_Data_Scientist_Resume.pdf`,
    summary: "Data scientist with a bias for methodological honesty — causal designs, pre-registration, and uncertainty reported as clearly as estimates.",
    skills: [
      { label: "Statistics", items: "Causal inference, difference-in-differences, synthetic control, HonestDiD, hypothesis testing, A/B testing, regression, forecasting" },
      { label: "Machine learning", items: "scikit-learn, LightGBM, XGBoost, CatBoost, Random Forest, SHAP, SMOTE, cross-validation" },
      { label: "Data & visualization", items: "Python, SQL, R, Pandas, Polars, DuckDB, GeoPandas, Tableau, Power BI, Plotly" },
      { label: "Platforms", items: "Spark, Databricks, Airflow, PostgreSQL, AWS, GCP, Git, Docker" },
    ],
    projects: [P.cordon, P.aeropulse, P.ledgerline],
  },
  {
    id: "mlops",
    label: "MLOps Engineer",
    file: `${base}_MLOps_Engineer_Resume.pdf`,
    summary: "MLOps engineer who makes data, models and evaluations reproducible — and keeps them honest in production.",
    skills: [
      { label: "MLOps", items: "MLflow, DVC, Airflow, Docker, Kubernetes, GitHub Actions, model registry, experiment tracking, drift monitoring, automated retraining" },
      { label: "Serving & observability", items: "FastAPI, batch / real-time inference, OpenTelemetry, latency monitoring, eval gates in CI" },
      { label: "Cloud", items: "AWS, GCP Cloud Run, Azure, Databricks, IAM / RBAC" },
      { label: "ML & data", items: "Python, SQL, PySpark, scikit-learn, LightGBM, PyTorch, PostgreSQL, Snowflake" },
    ],
    projects: [P.charlie, P.gpu, P.helio],
  },
  {
    id: "analyst",
    label: "Data Analyst",
    file: `${base}_Data_Analyst_Resume.pdf`,
    summary: "Data analyst who builds the pipelines under the dashboard — certified metrics, reconciled KPIs, and honest uncertainty.",
    skills: [
      { label: "Analytics", items: "SQL, Python, R, Excel, KPI design, cohort and trend analysis, forecasting, statistical testing, A/B testing" },
      { label: "BI & visualization", items: "Power BI, Tableau, Grafana, Plotly, Matplotlib, Seaborn, geospatial visualization" },
      { label: "Modeling", items: "dbt, Cube, Snowflake, PostgreSQL, MySQL, dimensional modeling, data validation, metric definitions" },
      { label: "Platforms", items: "Pandas, Spark, Databricks, Airflow, Git, AWS, GCP" },
    ],
    projects: [P.aeropulse, P.dockline, P.cordon],
  },
];

export const resumeExperience = [
  {
    org: "Intelligent DataWorks",
    role: "Data & AI Engineer Co-op",
    place: "Boston, MA",
    period: "Jan 2026 – Aug 2026",
    bullets: [
      "Shipped two production RAG systems on LangChain with a pgvector-backed PostgreSQL store — an employment-decision compliance checker and a semantic HR knowledge-base assistant that replaced manual policy lookup with citation-backed answers.",
      "Engineered citation-backed generation with span-level source attribution and tuned chunk size, overlap and top-k retrieval so generated claims trace to verifiable passages.",
      "Delivered an LLM-assisted interview-scheduling platform end to end: candidate–interviewer matching, a multi-step Streamlit workflow, a normalized PostgreSQL schema, and RFC 5545 calendar dispatch through AWS SES.",
      "Built LLM skills-gap analysis and structured extraction; extended the FastAPI platform with a pluggable skill registry, Google OAuth 2.0, RS256 JWT, Docker and Flyway migrations.",
    ],
  },
  {
    org: "Flare Innovations",
    role: "Machine Learning Engineer",
    place: "Chennai, India",
    period: "Jan 2022 – May 2024",
    bullets: [
      "Engineered an AI-driven hydroponic farming system integrating IoT sensing with computer-vision stress detection, reducing manual tuning by about 40%.",
      "Prototyped OpenCV / CNN leaf-disease detection at 85–87% accuracy, enabling early interventions that lowered plant loss by about 20% in pilots.",
      "Integrated Arduino and Raspberry Pi sensor streams with automated pH, nutrient-flow, temperature and humidity control for 24/7 autonomous operation.",
      "Built a Python monitoring and anomaly-detection dashboard that reduced agronomic decision latency by about 60%.",
    ],
  },
];
