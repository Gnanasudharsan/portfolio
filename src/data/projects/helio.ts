import type { Project } from "../types";

const repo = "https://github.com/Gnanasudharsan/enterprise-agentic-assistant";
const src = (p: string) => `${repo}/blob/main/${p}`;

export const helio: Project = {
  slug: "helio",
  name: "Helio — Agentic Enterprise Research & Workflow Assistant",
  short: "Helio",
  tagline: "A multi-agent assistant that researches governed documents, queries data read-only, and acts only with human approval.",
  thesis:
    "Most of the gain over RAG came from orchestration, not retrieval — and every boundary that matters is enforced in code before the model ever sees the data.",
  categories: ["AI / Agents", "ML Systems", "Full Stack"],
  status: "Live",
  period: "Oct – Nov 2026",
  year: 2026,
  layout: "feature",
  accent: "blue",
  problem:
    "Company knowledge is split between documents and operational databases. A chatbot or plain RAG pipeline can quote a policy, but it can't compare metrics, connect evidence across sources, or take a follow-up action safely.",
  built:
    "A LangGraph supervisor that plans before retrieving, then fans out to a docs agent (permission-aware hybrid search inside PostgreSQL), a data agent (validated read-only SQL), an analyst that cites every claim, and an action agent whose tool calls run only after a human approves the exact arguments.",
  stack: ["LangGraph", "FastAPI", "PostgreSQL", "pgvector", "MCP", "Pydantic", "sqlglot", "React", "TypeScript", "OpenTelemetry", "Cloud Run", "Cloud SQL"],
  headline: {
    value: "53% → 78%",
    label: "Task success, vector RAG → multi-agent",
    context: "First held-out run, 32-task benchmark (91% after fixes, disclosed separately)",
    kind: "measured",
    source: src("evals/reports/benchmark-2026-10-31-initial.md"),
  },
  metrics: [
    {
      value: "78%",
      label: "Task success, first held-out run",
      context: "Multi-agent vs 53% vector RAG and 56% hybrid + rerank; 32 tasks, gpt-4.1-mini",
      kind: "measured",
      source: src("evals/reports/benchmark-2026-10-31-initial.md"),
    },
    {
      value: "91%",
      label: "Task success after fixes",
      context: "Same 32 tasks — no longer strictly held out, reported as such",
      kind: "measured",
      source: src("evals/reports/benchmark-2026-10-31.md"),
    },
    {
      value: "20 / 20",
      label: "Prompt-injection attacks defended",
      context: "13 direct + indirect attacks across chat and agent (18 / 20 on first run)",
      kind: "measured",
      source: src("evals/reports/security-2026-10-31.md"),
    },
    {
      value: "0",
      label: "Unauthorized action executions",
      context: "9 / 9 API-level bypass attempts blocked + 15 unit scenarios",
      kind: "measured",
      source: src("evals/reports/security-2026-10-31.md"),
    },
    {
      value: "0.968",
      label: "Retrieval MRR@10, hybrid + LLM rerank",
      context: "vs 0.883 vector-only; 37 gold questions, 0 ACL leaks across all configs",
      kind: "measured",
      source: src("evals/reports/retrieval-2026-10-31.md"),
    },
    {
      value: "$2.18",
      label: "Cost per 1,000 tasks, multi-agent",
      context: "p50 / p95 latency 3.3 s / 5.7 s — about 3.7× the cost of vector RAG",
      kind: "measured",
      source: src("evals/reports/benchmark-2026-10-31.md"),
    },
  ],
  links: {
    github: repo,
    live: "https://helio-assistant-vpgub2ic6q-uc.a.run.app",
    docs: [
      { label: "Case study site", href: "https://helio-case-study.vercel.app" },
      { label: "Architecture", href: src("docs/ARCHITECTURE.md") },
      { label: "Decision records", href: `${repo}/tree/main/docs/adr` },
      { label: "Eval reports", href: `${repo}/tree/main/evals/reports` },
    ],
  },
  contribution: "Solo project — design, implementation, evaluation, and deployment.",
  architecture: {
    caption: "Planning happens before retrieval, so nothing a document says can add steps or actions. Approval is checked by the backend, not the model.",
    layers: ["Request", "Plan", "Agents", "Evidence", "Answer / act"],
    nodes: [
      { id: "ui", label: "React UI", detail: "Answers, citations, trace", layer: 0, tone: "serve" },
      { id: "guard", label: "API guards", detail: "Access code · rate limit · token budget", layer: 0, tone: "guard" },
      { id: "plan", label: "Supervisor", detail: "Pydantic-validated plan", layer: 1, tone: "model" },
      { id: "docs", label: "Docs agent", detail: "pgvector + FTS → RRF → rerank", layer: 2, tone: "model" },
      { id: "data", label: "Data agent", detail: "text-to-SQL → sqlglot", layer: 2, tone: "model" },
      { id: "action", label: "Action agent", detail: "Drafts MCP tool calls", layer: 2, tone: "model" },
      { id: "pg", label: "PostgreSQL", detail: "Chunks, ACLs, analytics, checkpoints", layer: 3, tone: "store" },
      { id: "ro", label: "Read-only role", detail: "analytics_reader, row cap", layer: 3, tone: "guard" },
      { id: "hitl", label: "Human approval", detail: "Interrupt · argument hash", layer: 3, tone: "guard" },
      { id: "analyst", label: "Analyst", detail: "[S#] / [T#] citations checked", layer: 4, tone: "serve" },
      { id: "mcp", label: "Tracker MCP", detail: "Audit log, at-most-once", layer: 4, tone: "serve" },
    ],
    edges: [
      { from: "ui", to: "plan" },
      { from: "guard", to: "plan" },
      { from: "plan", to: "docs" },
      { from: "plan", to: "data" },
      { from: "plan", to: "action" },
      { from: "docs", to: "pg" },
      { from: "data", to: "ro" },
      { from: "action", to: "hitl" },
      { from: "pg", to: "analyst" },
      { from: "ro", to: "analyst" },
      { from: "hitl", to: "mcp" },
    ],
  },
  decisions: [
    {
      title: "Plan before retrieval",
      body: "The supervisor commits to a validated JSON plan before any document is read, so injected text in a retrieved passage cannot add steps or trigger actions.",
    },
    {
      title: "Keep hybrid search inside Postgres",
      body: "pgvector cosine and full-text search are fused with reciprocal rank fusion, with ACLs applied in SQL — permissions hold before a passage can reach the model.",
    },
    {
      title: "Two independent SQL safety layers",
      body: "A sqlglot allow-list validates generated SQL, and it then runs as a least-privilege read-only role; integration tests prove the database refuses writes on its own.",
    },
    {
      title: "Approval bound to exact arguments",
      body: "Actions pause at a checkpointed LangGraph interrupt; execution re-checks permissions and a hash of the approved arguments, runs at most once, and appends to an audit log.",
    },
    {
      title: "Numbers come from SQL, never the model",
      body: "Every [S#] and [T#] marker is checked against the evidence actually supplied; invalid citations are stripped before the answer is returned.",
    },
    {
      title: "One Cloud Run instance on purpose",
      body: "Scale-to-zero with a single instance keeps the in-memory rate limiter and daily budget exact and stays within the smallest Cloud SQL tier's connection limit.",
    },
  ],
  sections: [
    {
      heading: "Evaluation protocol",
      body: [
        "A 32-task benchmark was written after the system was built and compares three systems on the same questions: vector RAG, hybrid retrieval with reranking, and the multi-agent graph. Groundedness is judged by a stronger model, and cost is metered on every call.",
        "The first, unbiased run and the post-fix run are both published. The 91% number is not held out anymore — the 78% one is the honest comparison.",
      ],
    },
    {
      heading: "Where the gain came from",
      body: [
        "Hybrid retrieval with reranking added three points over vector RAG. The data agent and orchestration added twenty-two more on the held-out run (thirty-five after fixes). After fixes, data questions went from 0% for both baselines to 88%, and cross-source questions to 67%.",
      ],
    },
  ],
  reliability: [
    "Checkpointed LangGraph runs resume from the last completed step; transient DB errors retry with backoff.",
    "OpenTelemetry spans from request → node → model call → retrieval → SQL → MCP.",
    "Security suite: 13 direct and indirect prompt-injection attacks with poisoned documents, plus 9 unauthorized-action attempts.",
    "CI: lint, unit tests, integration tests against pgvector, and a Docker Compose smoke test that approves an action and verifies a second approval is refused.",
  ],
  charts: [
    {
      title: "Task success by system",
      subtitle: "32-task benchmark · gpt-4.1-mini · judge gpt-4.1",
      unit: "%",
      better: "higher",
      bars: [
        { label: "Vector RAG", value: 53 },
        { label: "Hybrid + rerank", value: 56 },
        { label: "Multi-agent · first run", value: 78, highlight: true, note: "held out" },
        { label: "Multi-agent · after fixes", value: 91, note: "not held out" },
      ],
      source: src("evals/reports/benchmark-2026-10-31.md"),
      footnote: "Small synthetic corpus written by the same author — the comparison between systems is the signal, not the absolute numbers.",
    },
    {
      title: "Retrieval quality, MRR@10",
      subtitle: "37 gold questions · 12 synthetic documents",
      unit: "",
      better: "higher",
      bars: [
        { label: "Keyword (FTS)", value: 0.859 },
        { label: "Vector", value: 0.883 },
        { label: "Hybrid (RRF)", value: 0.901 },
        { label: "Hybrid + MiniLM", value: 0.946 },
        { label: "Hybrid + LLM rerank", value: 0.968, highlight: true },
      ],
      source: src("evals/reports/retrieval-2026-10-31.md"),
    },
  ],
  lessons: [
    "The first run is the real number. Publishing 78% next to 91% is what makes the 91% believable.",
    "A result worse than the baseline is a bug report: cross-encoders first underperformed because they were missing the heading path.",
    "Repeat anything that flips. One task invented a sales target in 2 of 5 runs; after the fix it held 10 / 10.",
    "Production finds what tests don't — the first Cloud Run boot failed on a pool-size mismatch, so CI now starts the image with production settings.",
  ],
  caveats: [
    "All data is a fictional company with clearly labeled synthetic records.",
    "The live demo needs an access code (paid model) and scales to zero, so the first request is slow.",
    "One run per task at temperature 0.3 — expect a few points of run-to-run variation.",
  ],
  visual: {
    src: "/images/helio/answer-with-data.png",
    alt: "Helio answering why onboarding time rose in September, with cited document passages and charts generated from read-only SQL results.",
    width: 1600,
    height: 1000,
    frame: "helio · cited answer",
  },
  gallery: [
    {
      src: "/images/helio/trace.png",
      alt: "Execution trace showing the plan and a timing waterfall of parallel agent steps with model calls and token counts.",
      width: 1600,
      height: 1000,
      caption: "Plan and timing waterfall — parallel agent waves with tokens per call.",
    },
    {
      src: "/images/helio/approval.png",
      alt: "A drafted tracker issue awaiting human approve, edit or reject.",
      width: 1600,
      height: 1000,
      caption: "Human approval — the action runs only with these exact arguments.",
    },
  ],
  roles: { ai: 3, mlops: 2, ml: 2, "data-eng": 1, "data-sci": 1, analyst: 1 },
};
