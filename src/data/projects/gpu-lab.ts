import type { Project } from "../types";

const repo = "https://github.com/Gnanasudharsan/gpu-inference-performance-lab";
const src = (p: string) => `${repo}/blob/main/${p}`;

export const gpuLab: Project = {
  slug: "gpu-lab",
  name: "GPU Inference Performance Lab",
  short: "GPU Lab",
  tagline: "A reproducible lab for small-batch inference latency: fused kernels, CUDA graphs, and serving — measured with paired trials and confidence intervals.",
  thesis:
    "At 1–8 rows a forward pass is launch- and bandwidth-bound, not FLOP-bound — so the honest question is which part of the system actually decides latency.",
  categories: ["ML Systems", "MLOps", "Research"],
  status: "Research",
  period: "Nov 2026",
  year: 2026,
  layout: "wide",
  accent: "neutral",
  problem:
    "Eager PyTorch pays a fixed cost for 64 kernel launches per forward and round-trips every intermediate through memory. For latency-sensitive small-batch inference, that overhead dominates — but separate benchmark runs on the same laptop differed by up to 2.2×, so naive measurement can't tell you what helped.",
  built:
    "A benchmarking harness around an RMSNorm → SwiGLU → residual MLP stack (34.6M parameters) comparing eager PyTorch, fused weights, torch.compile, hand-written Metal kernels, Triton kernels, and CUDA graphs — every variant gated against a float64 reference, timed in interleaved paired trials, and published to a static dashboard.",
  stack: ["PyTorch", "Metal / MPS", "CUDA", "Triton", "CUDA Graphs", "torch.compile", "Nsight Systems", "FastAPI", "Next.js"],
  headline: {
    value: "1.98×",
    label: "CUDA-graph speedup vs eager",
    context: "NVIDIA Tesla T4 · 8 rows · 95% CI [1.96, 1.99]",
    kind: "measured",
    source: src("docs/NVIDIA_T4.md"),
  },
  metrics: [
    {
      value: "1.16–1.26×",
      label: "Fused Metal kernels vs eager, 1–8 rows",
      context: "Apple M4 · MPS · fp16 · paired 95% CIs",
      kind: "measured",
      source: src("README.md"),
    },
    {
      value: "64 → 8",
      label: "Kernel launches per forward",
      context: "Apple M4 · fused Metal path at ≤ 8 rows",
      kind: "measured",
      source: src("README.md"),
    },
    {
      value: "1.98×",
      label: "Eager + CUDA graph vs eager",
      context: "NVIDIA Tesla T4 (Kaggle) · 8 rows · [1.96, 1.99]",
      kind: "measured",
      source: src("docs/NVIDIA_T4.md"),
    },
    {
      value: "0.38×",
      label: "Own Triton kernels vs eager — a slowdown",
      context: "NVIDIA Tesla T4 · 8 rows · lost to cuBLAS; reported, not hidden",
      kind: "measured",
      source: src("docs/NVIDIA_T4.md"),
    },
    {
      value: "7",
      label: "Bugs only real NVIDIA hardware exposed",
      context: "Incl. a CUDA-graph lifetime bug and a Triton re-autotune that hit serving p99",
      kind: "reported",
      source: src("docs/NVIDIA_T4.md"),
    },
    {
      value: "289",
      label: "Correctness tests passed on real T4",
      context: "Float64 reference gate before anything is timed",
      kind: "measured",
      source: `${repo}/tree/main/results/gpu/kaggle-t4-20261110-1753`,
    },
  ],
  links: {
    github: repo,
    live: "https://gpu-inference-performance-lab.vercel.app",
    docs: [
      { label: "Engineering report", href: src("docs/ENGINEERING_REPORT.md") },
      { label: "NVIDIA T4 results", href: src("docs/NVIDIA_T4.md") },
      { label: "Benchmark methodology", href: src("docs/BENCHMARK_METHODOLOGY.md") },
      { label: "Known limitations", href: src("docs/KNOWN_LIMITATIONS.md") },
    ],
  },
  contribution: "Solo project. The dashboard is live; the GPU benchmark API is packaged but not deployed (the public Live page runs on a CPU container, labeled as such).",
  architecture: {
    caption: "The harness refuses to time an implementation that fails the correctness gate. Every record carries hardware, versions, and git commit.",
    layers: ["Configure", "Implement", "Verify", "Record", "Publish"],
    nodes: [
      { id: "cfg", label: "Experiment configs", detail: "TOML per sweep", layer: 0, tone: "source" },
      { id: "runner", label: "Paired runner", detail: "Interleaved, rotated order", layer: 0, tone: "process" },
      { id: "eager", label: "Eager / compile", detail: "PyTorch baselines", layer: 1, tone: "model" },
      { id: "metal", label: "Metal kernels", detail: "Fused GEMV · Apple M4", layer: 1, tone: "model" },
      { id: "triton", label: "Triton + CUDA graphs", detail: "NVIDIA T4", layer: 1, tone: "model" },
      { id: "gate", label: "Correctness gate", detail: "float64 reference", layer: 2, tone: "guard" },
      { id: "jsonl", label: "Results JSONL", detail: "Provenance per record", layer: 3, tone: "store" },
      { id: "analyze", label: "Analysis", detail: "Geomean ratios · bootstrap CI", layer: 3, tone: "process" },
      { id: "dash", label: "Static dashboard", detail: "Next.js on Vercel", layer: 4, tone: "serve" },
    ],
    edges: [
      { from: "cfg", to: "runner" },
      { from: "runner", to: "eager" },
      { from: "runner", to: "metal" },
      { from: "runner", to: "triton" },
      { from: "eager", to: "gate" },
      { from: "metal", to: "gate" },
      { from: "triton", to: "gate" },
      { from: "gate", to: "jsonl" },
      { from: "jsonl", to: "analyze" },
      { from: "analyze", to: "dash" },
    ],
  },
  decisions: [
    {
      title: "Paired, interleaved trials",
      body: "Separate runs on the M4 differed by up to 2.2×, so variants run interleaved in rotated order and speedup is the geometric mean of per-trial ratios with bootstrap 95% CIs.",
    },
    {
      title: "An independent float64 reference",
      body: "Every implementation is checked against a float64 CPU reference (itself cross-checked against NumPy), not against eager in the same dtype. The checker was shown to catch four injected bugs.",
    },
    {
      title: "Separate passes for host and device time",
      body: "Recording GPU events perturbed host latency on MPS, so wall-clock latency and device-event time are measured in separate passes.",
    },
    {
      title: "Custom kernels only where they win",
      body: "Fused Metal GEMV kernels are used at ≤ 8 rows; above that the path hands GEMMs back to MPS at a measured crossover (16 rows: no significant difference).",
    },
    {
      title: "Never estimate hardware you don't have",
      body: "CUDA numbers were never simulated. NVIDIA paths were marked pending until a real T4 session, and hand-written PTX wasn't attempted without hardware to validate it.",
    },
  ],
  sections: [
    {
      heading: "Hardware honesty",
      body: [
        "Kernel development and most measurements ran on an Apple M4 laptop GPU through Metal / MPS. NVIDIA results come from one free Kaggle session on a Tesla T4 — a shared, virtualized, launch-bound host. Those numbers describe that setup, not data-center GPUs in general.",
        "The two sets of results are never mixed: every number on this page names the device it was measured on.",
      ],
    },
    {
      heading: "What actually decides latency",
      body: [
        "On the M4 the 1.2× kernel speedup barely moves end-to-end serving: a served request takes about 2 ms against about 0.8 ms of compute, so the host↔GPU round trip is the next lever. On the launch-bound T4, CUDA graphs beat every kernel change — and the hand-written Triton kernels lost to cuBLAS.",
      ],
    },
  ],
  reliability: [
    "228 tests pass locally (199 device-specific skips); 289 correctness tests passed on the real T4.",
    "A performance-regression gate re-runs the headline comparison and fails CI outside a 5% margin.",
    "Seven bugs were found only on real NVIDIA hardware — including a CUDA-graph lifetime bug and a Triton re-autotune that pushed serving p99 to 12.7 s before the fix brought it to 10 ms.",
  ],
  charts: [
    {
      title: "Apple M4 — time per forward",
      subtitle: "Metal / MPS · fp16 · 1024×2816×4 · 8 rows · lower is better",
      unit: "µs",
      better: "lower",
      bars: [
        { label: "Eager PyTorch", value: 1053 },
        { label: "Fused Metal kernels", value: 845, highlight: true, note: "1.20× [1.14, 1.27]" },
      ],
      source: src("README.md"),
    },
    {
      title: "NVIDIA Tesla T4 — speedup vs eager",
      subtitle: "CUDA · fp16 · 8 rows · one Kaggle session · higher is better",
      unit: "×",
      better: "higher",
      bars: [
        { label: "Eager (baseline)", value: 1 },
        { label: "Eager + CUDA graph", value: 1.98, low: 1.96, high: 1.99, highlight: true },
        { label: "Fused weights", value: 1.7, low: 1.67, high: 1.73 },
        { label: "torch.compile", value: 1.55, low: 1.46, high: 1.6 },
        { label: "compile · reduce-overhead", value: 0.99, low: 0.98, high: 1.0 },
        { label: "Own Triton kernels", value: 0.38, low: 0.36, high: 0.41, note: "slower" },
      ],
      source: src("docs/NVIDIA_T4.md"),
      footnote: "Triton slowdown cause (under-occupancy at small M) is a hypothesis in the repo, not yet confirmed.",
    },
  ],
  lessons: [
    "A faster kernel isn't a faster service — measure where end-to-end time actually goes before optimizing.",
    "My first Metal kernel regressed to 0.77× because it reloaded activations per column; v2 fixed it (1.67× over v1).",
    "Real hardware finds real bugs. Seven of them only appeared on the T4.",
  ],
  caveats: [
    "Synthetic weights and inputs; single device per platform.",
    "T4 results come from one session — no between-session confidence intervals.",
    "The M4 GPU also drives the display, so absolute latencies are indicative; paired speedups are the robust quantity.",
  ],
  visual: {
    src: "/images/gpu-lab/overview-live.png",
    alt: "GPU Inference Performance Lab dashboard overview: fused-kernel speedup, kernel launches, bandwidth tiles and a time-per-forward chart across batch sizes on Apple M4.",
    width: 1440,
    height: 900,
    frame: "gpu-inference-performance-lab.vercel.app",
  },
  roles: { ml: 3, mlops: 3, ai: 1, "data-sci": 1 },
};
