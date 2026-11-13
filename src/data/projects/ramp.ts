import type { Project } from "../types";

const repo = "https://github.com/Gnanasudharsan/ramp-accessibility-agent";
const src = (p: string) => `${repo}/blob/main/${p}`;

export const ramp: Project = {
  slug: "ramp",
  name: "Ramp — Agentic Accessibility Auditor",
  short: "Ramp",
  tagline: "Finds WCAG barriers that rule engines miss, writes minimal fixes, verifies them on a re-rendered page, and opens a PR only after a human approves the diff.",
  thesis:
    "Rule engines catch what is mechanically detectable; the judgment calls — meaningless alt text, unclear links — need a model, and the model needs a cage.",
  categories: ["AI / Agents", "Full Stack", "Research"],
  status: "In Development",
  period: "Nov 2026",
  year: 2026,
  layout: "pair",
  accent: "teal",
  problem:
    "axe-core and similar tools only find issues that can be detected mechanically. Judgment issues — alt text that says nothing, link text without purpose, text baked into images — slip through, and every fix is manual work.",
  built:
    "A LangGraph pipeline: polite sandboxed crawl → axe-core rule checks → schema-validated model checks on collected candidates → deduplicate and prioritize from fixed tables → single exact-substring patch → re-render and verify → human review → PR through the GitHub MCP server.",
  stack: ["LangGraph", "Playwright", "axe-core", "MCP", "LiteLLM", "FastAPI", "Redis", "Langfuse", "Next.js", "Docker"],
  headline: {
    value: "0.604 → 0.961",
    label: "F1, axe-only baseline → Ramp agent",
    context: "37 labeled synthetic pages; judgment-label recall 0.00 → 1.00",
    kind: "measured",
    source: src("evals/results/comparison.md"),
  },
  metrics: [
    {
      value: "21 / 21",
      label: "Judgment issues found",
      context: "Baseline finds 0 — the gap rule engines leave",
      kind: "measured",
      source: src("evals/results/ramp-agent/full.md"),
    },
    {
      value: "45 / 48",
      label: "Fixes verified on re-render",
      context: "Violation gone, no new axe violations, page still renders",
      kind: "measured",
      source: src("evals/results/ramp-agent/full.md"),
    },
    {
      value: "317 / 317",
      label: "axe findings reproduced exactly",
      context: "vs @axe-core/playwright on 8 W3C BAD pages",
      kind: "measured",
      source: src("evals/results/bad_reproduction.md"),
    },
    {
      value: "6 / 10",
      label: "Prompt-injection pages resisted",
      context: "Phase 3 run — reported as not yet good enough; target ≥ 95%",
      kind: "measured",
      source: src("evals/results/ramp-agent/full.md"),
    },
    {
      value: "0",
      label: "False positives on clean control pages",
      context: "5 control pages; gate allows ≤ 1",
      kind: "measured",
      source: src("evals/results/ramp-agent/full.md"),
    },
    {
      value: "≥ 95%",
      label: "Strict injection resistance",
      context: "Phase 4 target set in ADR 0006",
      kind: "target",
      source: src("docs/adr/0006-security-model.md"),
    },
  ],
  links: {
    github: repo,
    live: "https://gnanasudharsan.github.io/ramp-accessibility-agent/",
    docs: [
      { label: "Results site", href: "https://gnanasudharsan.github.io/ramp-accessibility-agent/results/" },
      { label: "Decision records", href: `${repo}/tree/main/docs/adr` },
      { label: "Demo target site", href: "https://github.com/Gnanasudharsan/ramp-demo-site" },
    ],
  },
  contribution: "Solo project. The live link is the project and results site; the auditor itself runs locally under Docker Compose.",
  architecture: {
    caption: "Models never hold tools. Each node has an explicit allowlist, and every fix must pass verification before a human sees it.",
    layers: ["Crawl", "Detect", "Decide", "Fix", "Ship"],
    nodes: [
      { id: "crawl", label: "Sandboxed crawl", detail: "Playwright · robots · SSRF block", layer: 0, tone: "source" },
      { id: "axe", label: "Rule checks", detail: "axe-core 4.14 + probes", layer: 1, tone: "process" },
      { id: "vision", label: "Model checks", detail: "Schema-validated JSON, no tools", layer: 1, tone: "model" },
      { id: "merge", label: "Merge & prioritize", detail: "Fixed severity tables", layer: 2, tone: "process" },
      { id: "gen", label: "Generate fix", detail: "Single exact-substring patch", layer: 3, tone: "model" },
      { id: "verify", label: "Verify", detail: "Re-render · axe diff · pixel diff", layer: 3, tone: "guard" },
      { id: "human", label: "Human review", detail: "Approve the exact diff", layer: 4, tone: "guard" },
      { id: "pr", label: "Pull request", detail: "GitHub MCP, scoped toolsets", layer: 4, tone: "serve" },
    ],
    edges: [
      { from: "crawl", to: "axe" },
      { from: "crawl", to: "vision" },
      { from: "axe", to: "merge" },
      { from: "vision", to: "merge" },
      { from: "merge", to: "gen" },
      { from: "gen", to: "verify", label: "≤ 2 tries" },
      { from: "verify", to: "human" },
      { from: "human", to: "pr" },
    ],
  },
  decisions: [
    {
      title: "Benchmark before the first model check",
      body: "The 37-page benchmark and the axe-only baseline were built first, so every model-based improvement is measured against a fixed reference.",
    },
    {
      title: "Thresholds fixed before results were read",
      body: "Acceptance gates were written into an ADR before the first full agent eval, and misses are reported as misses.",
    },
    {
      title: "Deterministic wherever possible",
      body: "Focus visibility is a pixel diff, and severity and WCAG criterion come from fixed tables — never from model output.",
    },
    {
      title: "Layered injection defense",
      body: "Escaped JSON data blocks, random per-call boundaries, a per-call canary, output scrubbing, and a patch policy that forbids scripts, handlers, and new URLs.",
    },
  ],
  sections: [
    {
      heading: "Detection is not compliance",
      body: [
        "Ramp never reports a site as “compliant.” Automated tools catch only part of WCAG 2.1 AA, so every report recommends manual testing with assistive technology. Passing Ramp's checks means fewer known barriers — not a legal conclusion.",
      ],
    },
    {
      heading: "What didn't work yet",
      body: [
        "On the W3C BAD pages the agent did not beat the baseline, because free-tier rate limiting caused 53 failed model calls — the repo says this is not a valid recall measurement. Injection resistance in the Phase 3 run was 6 / 10, below the bar the project set for itself.",
      ],
    },
  ],
  reliability: [
    "CI eval gate: rule recall = 1.0, judgment recall ≥ 0.6, precision ≥ 0.85, ≤ 1 control false positive, 0 canary leaks, and 0 failed model calls (a run with failures is inconclusive).",
    "Browser sandbox: read-only root filesystem, all capabilities dropped, no secrets, isolated networks — with a committed self-check.",
    "Prompts are versioned, and their hashes are recorded in every result file.",
  ],
  charts: [
    {
      title: "Baseline vs agent",
      subtitle: "37 labeled synthetic pages",
      unit: "",
      better: "higher",
      bars: [
        { label: "F1 · axe baseline", value: 0.604 },
        { label: "F1 · Ramp agent", value: 0.961, highlight: true },
        { label: "Judgment recall · baseline", value: 0 },
        { label: "Judgment recall · agent", value: 1, highlight: true },
      ],
      source: src("evals/results/comparison.md"),
      footnote: "Small single-author benchmark; per-criterion numbers with few labels should not be over-read.",
    },
  ],
  lessons: [
    "Fix the yardstick first. Thresholds written down before the run make a miss impossible to rationalize.",
    "Count only what the agent actually adds: only added diff lines count as Ramp output, and quota failures no longer count as “resisted.”",
  ],
  caveats: [
    "Research prototype: Phases 0–3 are tagged; later security, GitHub and training work is committed but not formally completed.",
    "The distilled vision model has no committed evaluation and is not claimed as a result.",
    "Latency p95 includes free-tier rate-limit waits.",
  ],
  visual: {
    src: "/images/ramp/results.png",
    alt: "Ramp results site: a table showing Ramp's crawler reproduces axe-core findings exactly on all eight W3C before-and-after demo pages.",
    width: 1440,
    height: 900,
    frame: "gnanasudharsan.github.io/ramp-accessibility-agent",
  },
  roles: { ai: 3, ml: 1, mlops: 2, "data-sci": 1 },
};
