import type { SkillGroup } from "./types";

/**
 * Skills are grouped by the kind of system they build. `core` is what
 * the site shows first; `more` expands on demand. `evidence` lists
 * project slugs where the skill group is demonstrated.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "ai",
    title: "AI & agentic systems",
    blurb: "Retrieval, orchestration, tool governance, and evaluation for LLM applications that have to be right.",
    core: ["RAG", "LangGraph", "LangChain", "MCP", "pgvector", "Hybrid retrieval", "Reranking", "Tool calling", "LLM evaluation"],
    more: [
      "Embeddings",
      "Semantic search",
      "Structured extraction",
      "Grounded generation",
      "Citation verification",
      "Prompt & context engineering",
      "OpenAI APIs",
      "Gemini APIs",
      "Hugging Face Transformers",
    ],
    roles: ["ai", "mlops"],
    evidence: ["helio", "ramp"],
  },
  {
    id: "ml",
    title: "Machine learning",
    blurb: "From gradient-boosted tabular models to CNNs and sequence models, with honest evaluation and explainability.",
    core: ["PyTorch", "scikit-learn", "LightGBM", "XGBoost", "CNNs", "SHAP", "Causal inference", "Forecasting"],
    more: ["TensorFlow", "Keras", "CatBoost", "Random Forest", "YOLO", "LIME", "SMOTE", "Feature engineering", "Hyperparameter tuning"],
    roles: ["ml", "data-sci"],
    evidence: ["gpu-lab", "charlie", "cordon"],
  },
  {
    id: "data",
    title: "Data engineering",
    blurb: "Batch and streaming pipelines with orchestration, contracts, and data-quality gates at every boundary.",
    core: ["Python", "SQL", "PySpark", "Airflow", "Dagster", "dbt", "Kafka", "Data quality"],
    more: ["Spark", "Databricks", "Delta Lake", "ETL / ELT", "CDC", "Streaming pipelines", "Orchestration", "Dimensional modeling"],
    roles: ["data-eng", "analyst"],
    evidence: ["dockline", "aeropulse", "charlie"],
  },
  {
    id: "stores",
    title: "Data stores & warehousing",
    blurb: "Relational, time-series, vector, and warehouse storage chosen for the access pattern, not the trend.",
    core: ["PostgreSQL", "TimescaleDB", "pgvector", "Snowflake", "BigQuery", "Redis"],
    more: ["MySQL", "MongoDB", "Amazon Redshift", "Flyway migrations", "Schema design"],
    roles: ["data-eng", "analyst"],
    evidence: ["dockline", "tidewater", "helio"],
  },
  {
    id: "mlops",
    title: "MLOps & platform",
    blurb: "Versioned data, tracked experiments, containerized services, and monitoring that catches drift before users do.",
    core: ["MLflow", "DVC", "Docker", "FastAPI", "GitHub Actions", "Drift monitoring", "Schema validation"],
    more: ["Kubernetes", "CI/CD", "Model serving", "Experiment tracking", "Reproducibility", "Observability", "Canary & shadow concepts"],
    roles: ["mlops", "ml"],
    evidence: ["charlie", "gpu-lab", "helio"],
  },
  {
    id: "cloud",
    title: "Cloud",
    blurb: "Serverless and container deployments with least-privilege access and production-style configuration.",
    core: ["AWS", "GCP", "Cloud Run", "AWS S3", "AWS SES", "Vercel"],
    more: ["Azure", "Cloud SQL", "Serverless infrastructure", "IAM / RBAC"],
    roles: ["mlops", "data-eng"],
    evidence: ["helio", "charlie", "aeropulse"],
  },
  {
    id: "analytics",
    title: "Analytics & BI",
    blurb: "Certified metrics, dashboards, and geospatial analysis that turn pipelines into decisions.",
    core: ["Power BI", "Grafana", "Tableau", "Plotly", "KPI design", "Geospatial analytics"],
    more: ["Matplotlib", "Seaborn", "GeoPandas", "MapLibre / Mapbox", "Excel", "Experimentation", "Semantic layers (Cube)"],
    roles: ["analyst", "data-sci"],
    evidence: ["dockline", "aeropulse", "cordon"],
  },
  {
    id: "backend",
    title: "Software engineering",
    blurb: "APIs, auth, typed frontends, and tests — the parts that make a model into a product.",
    core: ["TypeScript", "Next.js", "React", "REST APIs", "OAuth 2.0", "JWT", "Testing"],
    more: ["NestJS", "Playwright", "Git", "Linux", "Bash", "HTML / CSS"],
    roles: ["ai"],
    evidence: ["ask-the-mesh", "aeropulse", "dockline"],
  },
];
