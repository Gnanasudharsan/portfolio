import type { Project } from "../types";

const repo = "https://github.com/Gnanasudharsan/Charlie";
const src = (p: string) => `${repo}/blob/main/${p}`;

export const charlie: Project = {
  slug: "charlie",
  name: "Charlie — Conversational Transit Intelligence",
  short: "Charlie",
  tagline: "An end-to-end MLOps system for Boston's MBTA: versioned ingestion, tracked delay models with bias and drift checks, and a conversational interface deployed on Cloud Run.",
  thesis:
    "The model is the smallest part of an ML product. Ingestion, versioning, monitoring and deployment are where it either holds up or falls over.",
  categories: ["MLOps", "ML Systems", "Data Engineering", "AI / Agents"],
  status: "Archived",
  period: "Sep – Dec 2025",
  year: 2025,
  layout: "wide",
  accent: "rose",
  problem:
    "MBTA riders get arrival times but no sense of delay risk, and transit data is noisy: feeds arrive late, incomplete or malformed. A useful assistant has to combine live data, a predictive model, and plain-language access — without breaking when the upstream API does.",
  built:
    "A team course system (IE 7374 MLOps, Group 22): Airflow DAGs for collection, processing and data quality; DVC-versioned datasets; logistic-regression and LightGBM delay models tracked in MLflow with SHAP, Fairlearn bias slices and KS/PSI drift checks; and a containerized conversational service with CI/CD to GCP Cloud Run.",
  stack: ["Airflow", "DVC", "MLflow", "LightGBM", "scikit-learn", "SHAP", "Fairlearn", "Docker", "GitHub Actions", "GCP Cloud Run", "Flask", "Next.js"],
  headline: {
    value: "3rd",
    label: "MLOps Expo, hosted at Google Cambridge",
    context: "Northeastern MLOps course expo · team project",
    kind: "reported",
  },
  metrics: [
    { value: "3rd", label: "Place at the MLOps Expo (Google Cambridge)", context: "Team award", kind: "reported" },
    { value: "4", label: "Airflow DAGs", context: "Collection, processing, data quality, final DVC-integrated pipeline", kind: "measured", source: `${repo}/tree/main/Data_Pipeline` },
    { value: "PSI > 0.2", label: "Retraining trigger", context: "Or accuracy < 0.85 — documented thresholds", kind: "target", source: src("DEPLOYMENT_README.md") },
  ],
  links: {
    github: repo,
    docs: [
      { label: "Deployment guide", href: src("DEPLOYMENT_README.md") },
      { label: "Data pipeline", href: `${repo}/tree/main/Data_Pipeline` },
      { label: "Model development", href: `${repo}/tree/main/Model_Development` },
    ],
  },
  contribution:
    "Team project (Group 22, IE 7374 MLOps, Fall 2025), forked from a teammate's repository. In my fork I built the conversational API service, the Next.js frontend, the monitoring and retraining modules, and the GitHub Actions → Cloud Run deployment. The Cloud Run service is no longer running.",
  architecture: {
    caption: "Data and models are versioned end to end, so any prediction can be traced back to the data and run that produced it.",
    layers: ["Source", "Pipeline", "Version", "Model", "Monitor", "Serve"],
    nodes: [
      { id: "mbta", label: "MBTA v3 API", detail: "Predictions · vehicles · alerts", layer: 0, tone: "source" },
      { id: "af", label: "Airflow DAGs", detail: "Collect · process · quality", layer: 1, tone: "process" },
      { id: "dvc", label: "DVC", detail: "Versioned datasets", layer: 2, tone: "store" },
      { id: "train", label: "Training", detail: "LogReg · LightGBM · SMOTE", layer: 3, tone: "model" },
      { id: "mlflow", label: "MLflow", detail: "Runs + registry", layer: 3, tone: "store" },
      { id: "bias", label: "Bias & drift", detail: "Fairlearn · KS · PSI · SHAP", layer: 4, tone: "guard" },
      { id: "ci", label: "GitHub Actions", detail: "Test → build → deploy", layer: 5, tone: "process" },
      { id: "run", label: "Cloud Run", detail: "Conversational service", layer: 5, tone: "serve" },
    ],
    edges: [
      { from: "mbta", to: "af" },
      { from: "af", to: "dvc" },
      { from: "dvc", to: "train" },
      { from: "train", to: "mlflow" },
      { from: "mlflow", to: "bias" },
      { from: "bias", to: "ci" },
      { from: "ci", to: "run" },
    ],
  },
  decisions: [
    { title: "Split pipelines by responsibility", body: "Collection, processing and quality run as separate Airflow DAGs, with a final DAG that integrates DVC versioning." },
    { title: "Bias slices, not just a global score", body: "Fairness was evaluated per route-direction group with Fairlearn, and drift with KS tests and population stability index." },
    { title: "Explicit retraining triggers", body: "Retraining thresholds were written down (PSI > 0.2 or accuracy < 0.85) rather than left to judgment." },
    { title: "Push-to-deploy", body: "Every push to main runs tests, builds the container, and deploys to Cloud Run through GitHub Actions." },
  ],
  sections: [
    {
      heading: "What the model taught us",
      body: [
        "Delays are rare, so the data is extremely imbalanced. A gradient-boosted baseline reached near-perfect accuracy while predicting almost no delays at all. Model selection moved to ROC AUC with SMOTE-resampled training, and the lesson outlasted the project: accuracy is the wrong headline metric for rare events.",
      ],
    },
  ],
  reliability: [
    "Schema validation and fallback handling around the external MBTA feeds.",
    "Drift report committed with the model: one feature (stop_sequence) flagged by the KS test.",
    "CI/CD workflows for model checks and Cloud Run deployment.",
  ],
  lessons: [
    "On imbalanced problems, report precision–recall behaviour, never accuracy alone.",
    "Writing the retraining policy down before deployment forces the team to agree on what “degraded” means.",
  ],
  caveats: [
    "Course project; the Cloud Run deployment has since been shut down.",
    "The pipeline's git history was replaced in the fork, so authorship of shared pipeline and model code can't be attributed per person.",
  ],
  visual: {
    src: "/images/charlie/pipeline-graph.png",
    alt: "Airflow graph view of Charlie's final MBTA data pipeline DAG, showing collection, processing, validation and DVC tasks.",
    width: 1600,
    height: 807,
    frame: "Airflow · mbta_final_data_pipeline",
  },
  roles: { mlops: 3, ml: 2, "data-eng": 2, ai: 1, "data-sci": 1, analyst: 1 },
};
