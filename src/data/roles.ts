import type { Category, RoleId } from "./types";

export interface Role {
  id: RoleId;
  label: string;
  /** Short phrase shown when the lens is active. */
  focus: string;
  /** Explicit featured order — slugs of flagship projects. */
  order: string[];
  /** Default filter applied in the project explorer. */
  filter: Category | "All";
  skills: string[];
}

export const roles: Role[] = [
  {
    id: "ai",
    label: "AI Engineer",
    focus: "Agents, retrieval, tool governance, evaluation",
    order: ["helio", "ramp", "ask-the-mesh", "charlie", "gpu-lab", "dockline", "aeropulse", "cordon"],
    filter: "AI / Agents",
    skills: ["ai", "backend", "mlops"],
  },
  {
    id: "ml",
    label: "ML Engineer",
    focus: "Inference performance, model training, serving",
    order: ["gpu-lab", "charlie", "helio", "ledgerline", "ramp", "cordon", "aeropulse", "dockline"],
    filter: "ML Systems",
    skills: ["ml", "mlops", "ai"],
  },
  {
    id: "data-eng",
    label: "Data Engineer",
    focus: "Pipelines, warehouses, streaming, data quality",
    order: ["dockline", "aeropulse", "ledgerline", "tidewater", "charlie", "helio", "cordon", "gpu-lab"],
    filter: "Data Engineering",
    skills: ["data", "stores", "cloud"],
  },
  {
    id: "data-sci",
    label: "Data Scientist",
    focus: "Causal inference, modeling, uncertainty",
    order: ["cordon", "charlie", "ledgerline", "aeropulse", "gpu-lab", "dockline", "helio", "ramp"],
    filter: "Data Science",
    skills: ["ml", "analytics", "data"],
  },
  {
    id: "mlops",
    label: "MLOps Engineer",
    focus: "Reproducibility, CI/CD, monitoring, deployment",
    order: ["charlie", "gpu-lab", "helio", "ledgerline", "ramp", "dockline", "aeropulse", "tidewater"],
    filter: "MLOps",
    skills: ["mlops", "cloud", "ml"],
  },
  {
    id: "analyst",
    label: "Data Analyst",
    focus: "Metrics, dashboards, decision support",
    order: ["aeropulse", "dockline", "cordon", "ledgerline", "charlie", "helio", "gpu-lab", "ask-the-mesh"],
    filter: "Analytics",
    skills: ["analytics", "stores", "data"],
  },
];

export const roleById = (id: RoleId | null | undefined) => roles.find((r) => r.id === id) ?? null;
