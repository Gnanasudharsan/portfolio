export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://gnanaa.vercel.app").replace(/\/$/, "");

export const profile = {
  name: "Gnanasudharsan Ashokumar",
  firstName: "Gnanasudharsan",
  monogram: "GA",
  location: "Boston, Massachusetts",
  locationShort: "Boston, MA",
  title: "AI/ML & Data Engineer",
  positioning: ["AI / ML Systems Engineer", "Data Engineer", "Applied AI Engineer", "MLOps Engineer"],
  headline: "I build reliable AI systems and data platforms.",
  subhead:
    "AI/ML and data engineer in Boston building agentic applications, production ML infrastructure, real-time data platforms, and research-backed analytical systems.",
  credential: "M.S. Data Analytics Engineering · Northeastern University · Dec 2026",
  availability: "Open to full-time roles · 2027",
  email: "ashokumar.g@northeastern.edu",
  links: {
    github: "https://github.com/Gnanasudharsan",
    linkedin: "https://www.linkedin.com/in/gnanasudharsan/",
    scholar: "https://scholar.google.com/citations?user=qJAogF8AAAAJ&hl=en",
  },
  seo: {
    title: "Gnanasudharsan Ashokumar — AI/ML & Data Engineer",
    description:
      "AI/ML and data engineer in Boston. Agentic AI systems, ML inference and infrastructure, real-time data platforms, MLOps, and applied research — with measured, reproducible results.",
  },
} as const;

/** Small, verified numbers for the credibility strip. */
export const credibility = [
  { value: 10, suffix: "", label: "IEEE publications", detail: "2022–2024, all with DOIs" },
  { value: 3, suffix: "rd", label: "MLOps Expo at Google Cambridge", detail: "Charlie, team project" },
  { value: 6, suffix: "th", label: "SAUVC 2022, global", detail: "2nd nationally" },
  { value: 3.94, suffix: "", label: "Graduate GPA", detail: "M.S., Northeastern", decimals: 2 },
] as const;

export const philosophy = [
  {
    title: "Build with rigor.",
    body: "Typed interfaces, schema validation, migrations, and tests before features. A system I can't reason about isn't finished.",
  },
  {
    title: "Measure what matters.",
    body: "Benchmarks with confidence intervals, evaluation harnesses with baselines, and a clear line between measured results and targets.",
  },
  {
    title: "Make it reliable.",
    body: "Read-only defaults, human approval for consequential actions, observability, and graceful failure when upstream data is late or wrong.",
  },
] as const;

export const principles = [
  "Evidence over hype",
  "Reproducibility",
  "Production readiness",
  "Observability",
  "Human-in-the-loop safety",
  "Measurable outcomes",
] as const;

/** The career arc used on /about — physical systems upward to intelligent software. */
export const trajectory = [
  { stage: "Electronics & embedded", detail: "ECE degree; sensors, microcontrollers, Raspberry Pi, Jetson Nano." },
  { stage: "IoT & computer vision", detail: "Hydroponic control loops, leaf-disease CNNs, person tracking, AUV perception." },
  { stage: "Machine learning", detail: "Tabular, sequence and vision models; 10 IEEE papers across ML, CV and healthcare." },
  { stage: "Data engineering", detail: "Lakehouse ETL, CDC streams, time-series warehouses, semantic metric layers." },
  { stage: "MLOps", detail: "Versioned data, tracked experiments, drift checks, containerized serving on Cloud Run." },
  { stage: "Agentic AI & production systems", detail: "Production RAG, multi-agent orchestration, governed tools, evaluation-gated releases." },
] as const;
