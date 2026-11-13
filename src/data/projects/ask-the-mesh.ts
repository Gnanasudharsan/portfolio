import type { Project } from "../types";

const repo = "https://github.com/Gnanasudharsan/workmesh-company-visibility-platform";
const src = (p: string) => `${repo}/blob/main/${p}`;

export const askTheMesh: Project = {
  slug: "ask-the-mesh",
  name: "Ask the Mesh — Permission-Aware AI Copilot for WorkMesh",
  short: "Ask the Mesh",
  tagline: "A copilot for a multi-tenant company-visibility platform that answers in plain language using only the asking user's permissions — with zero leaks across 156 adversarial cases.",
  thesis:
    "Visibility without surveillance: an AI assistant must not see more than the person asking, and a restricted record must look exactly like a missing one.",
  categories: ["AI / Agents", "Full Stack"],
  status: "In Development",
  period: "Nov 2026",
  year: 2026,
  layout: "platform",
  accent: "neutral",
  problem:
    "WorkMesh connects people, projects, blockers and dependencies behind a server-side RBAC / ReBAC / ABAC policy engine and row-level security. A natural-language copilot on top of that is an obvious exfiltration path: one careless tool call and it answers with records the user was never allowed to see.",
  built:
    "An agent loop whose eight read-only tools go through a frozen facade bound to the request's auth context, each call in its own read-only RLS tenant transaction. Tool output reaches the model as escaped, untrusted data; citations are validated server-side against records returned in that request; and “Show on map” focuses the platform's company graph on the cited records.",
  stack: ["TypeScript", "NestJS", "PostgreSQL RLS", "Ollama", "Anthropic SDK", "Next.js", "React Flow", "Jest", "Playwright"],
  headline: {
    value: "0 leaks",
    label: "Across 156 permission-boundary eval cases",
    context: "26 golden questions × 6 personas · 42 / 42 existence probes · local qwen2.5:7b",
    kind: "measured",
    source: src("docs/COPILOT_EVALS.md"),
  },
  metrics: [
    { value: "0", label: "Restricted records leaked", context: "156 cases across 6 personas", kind: "measured", source: src("docs/COPILOT_EVALS.md") },
    { value: "42 / 42", label: "Existence probes answered as not-found", context: "Restricted looks identical to missing", kind: "measured", source: src("docs/COPILOT_EVALS.md") },
    { value: "5 / 5", label: "Prompt-injection canaries resisted", context: "Planted in employee-written text", kind: "measured", source: src("docs/COPILOT_EVALS.md") },
    { value: "1.00", label: "Citation precision (mean)", context: "Fact recall 0.74 — reported, not rounded up", kind: "measured", source: src("docs/COPILOT_EVALS.md") },
    { value: "4 / 5", label: "Declined to predict deadlines", context: "One failure; the rule is enforced by prompt only", kind: "measured", source: src("docs/COPILOT_EVALS.md") },
    { value: "+85", label: "Copilot tests added", context: "40 API integration + 45 unit (local run)", kind: "reported", source: src("README.md") },
  ],
  links: {
    github: repo,
    docs: [
      { label: "Copilot design & threat model", href: src("docs/COPILOT.md") },
      { label: "Copilot evaluation", href: src("docs/COPILOT_EVALS.md") },
      { label: "WorkMesh (upstream, by Sreevarshann)", href: "https://github.com/Sreevarshann/workmesh-company-visibility-platform" },
    ],
  },
  contribution:
    "WorkMesh — the org graph, policy engine, row-level security, real-time layer and Company Map — was built by Sreevarshann. I built the Ask the Mesh copilot on top of it: the agent loop, tool layer, read facade, citation validator, Ask page, map focus, tests and evaluation. Not deployed publicly.",
  architecture: {
    caption: "The copilot adds no second data store and no policy change — it reuses the platform's authorized services through a read-only facade.",
    layers: ["Ask", "Agent", "Tools", "Platform (upstream)", "Answer"],
    nodes: [
      { id: "ask", label: "Ask page", detail: "Next.js", layer: 0, tone: "serve" },
      { id: "ctrl", label: "Copilot endpoint", detail: "Rate-limited, off by default", layer: 0, tone: "guard" },
      { id: "loop", label: "Agent loop", detail: "Local model by default", layer: 1, tone: "model" },
      { id: "tools", label: "8 read-only tools", detail: "Escaped untrusted results", layer: 2, tone: "process" },
      { id: "facade", label: "Read facade", detail: "Bound to AuthContext", layer: 2, tone: "guard" },
      { id: "rls", label: "RLS transaction", detail: "Read-only, per tool call", layer: 3, tone: "store" },
      { id: "policy", label: "Policy engine", detail: "RBAC · ReBAC · ABAC", layer: 3, tone: "guard" },
      { id: "cite", label: "Citation validator", detail: "Only records seen this request", layer: 4, tone: "guard" },
      { id: "map", label: "Show on map", detail: "Company graph focus", layer: 4, tone: "serve" },
    ],
    edges: [
      { from: "ask", to: "ctrl" },
      { from: "ctrl", to: "loop" },
      { from: "loop", to: "tools" },
      { from: "tools", to: "facade" },
      { from: "facade", to: "rls" },
      { from: "facade", to: "policy" },
      { from: "loop", to: "cite" },
      { from: "cite", to: "map" },
    ],
  },
  decisions: [
    { title: "Reuse the authorized service layer", body: "Tools never receive the ORM or a database handle — a unit test enforces it. They call a frozen facade of ten read methods bound to the requester's auth context." },
    { title: "Restricted equals missing", body: "A record the user can't see returns exactly the same answer as one that doesn't exist, which closes existence-leak side channels." },
    { title: "Server-validated citations", body: "Citations must refer to records the tools returned in this request. One retry; an answer with no surviving citation becomes the standard not-found answer." },
    { title: "Treat employee text as untrusted", body: "Free text from updates and blockers reaches the model JSON-escaped inside an untrusted envelope, as a prompt-injection defense." },
    { title: "Private by default", body: "A local model is the default provider, the feature ships off, and question and answer text are never logged." },
  ],
  sections: [],
  reliability: [
    "Deterministic suites run with a fake provider; the live evaluation runs locally against the real model.",
    "Playwright journeys cover asking, citations, and map focus across responsive breakpoints.",
  ],
  charts: [],
  lessons: [
    "The safest AI feature is one that inherits an existing authorization model rather than re-implementing it.",
    "Report recall honestly. 0.74 fact recall with 1.00 citation precision is the right trade for this product — and it's still worth saying out loud.",
  ],
  caveats: [
    "Single-turn, no answer caching; misses the “goals at risk” question.",
    "Not deployed publicly; local runs and evaluation only.",
    "Screenshots use a fake provider, so answer wording is canned — citations and map focus are real.",
  ],
  visual: {
    src: "/images/ask-the-mesh/ask.png",
    alt: "Ask the Mesh chat panel answering a question about a project with inline citations to WorkMesh records.",
    width: 1600,
    height: 1000,
    frame: "workmesh · ask the mesh",
  },
  gallery: [
    {
      src: "/images/ask-the-mesh/on-map.png",
      alt: "Copilot answer focused on the WorkMesh company map, highlighting the cited people and projects.",
      width: 1600,
      height: 1000,
      caption: "“Show on map” focuses the platform's company graph on cited records.",
    },
  ],
  roles: { ai: 3, mlops: 1, "data-eng": 1 },
};
