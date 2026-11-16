/**
 * Content schema for the portfolio. Every page renders from these types,
 * so updating the site means editing `src/data/*` — never JSX.
 *
 * Truthfulness contract:
 *  - `Metric.kind` distinguishes measured results from targets.
 *  - `Metric.source` must point at the repo file the number came from.
 *  - `ProjectStatus` must match the repository's own description.
 */

export type RoleId =
  | "ai"
  | "ml"
  | "data-eng"
  | "data-sci"
  | "mlops"
  | "analyst";

export type Category =
  | "AI / Agents"
  | "ML Systems"
  | "Data Engineering"
  | "Data Science"
  | "Analytics"
  | "MLOps"
  | "Research"
  | "Computer Vision"
  | "Full Stack"
  | "IoT / Embedded";

export type ProjectStatus =
  | "Live"
  | "Production"
  | "Research"
  | "Case Study"
  | "In Development"
  | "Archived";

export interface Metric {
  value: string;
  label: string;
  /** Hardware, dataset, or conditions the number was produced under. */
  context?: string;
  kind: "measured" | "target" | "reported";
  /** Repository-relative path (or URL) the number is taken from. */
  source?: string;
}

export interface LinkRef {
  label: string;
  href: string;
}

export interface ArchNode {
  id: string;
  label: string;
  detail?: string;
  /** Column (0-based) in the layered diagram. */
  layer: number;
  tone?: "source" | "process" | "store" | "serve" | "model" | "guard";
}

export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Architecture {
  caption: string;
  layers: string[];
  nodes: ArchNode[];
  edges: ArchEdge[];
}

export interface ChartSeries {
  title: string;
  subtitle?: string;
  unit: string;
  /** "lower" when smaller is better (latency). */
  better: "lower" | "higher";
  bars: { label: string; value: number; low?: number; high?: number; highlight?: boolean; note?: string }[];
  source?: string;
  footnote?: string;
}

export interface Finding {
  outcome: string;
  estimate: string;
  interval?: string;
  verdict: "robust" | "fragile" | "unsupported" | "null";
  note?: string;
  /** For the forest plot; same units across a chart. */
  point?: number;
  low?: number;
  high?: number;
}

export interface Decision {
  title: string;
  body: string;
}

export interface CaseSection {
  heading: string;
  body: string[];
  bullets?: string[];
}

export interface Visual {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  /** Rendered inside a browser frame with this URL label. */
  frame?: string;
}

export interface Project {
  slug: string;
  name: string;
  /** Short title shown in compact lists. */
  short: string;
  tagline: string;
  /** One-sentence thesis for the case-study hero. */
  thesis: string;
  categories: Category[];
  status: ProjectStatus;
  period: string;
  year: number;
  /** Visual treatment on the home page. */
  layout: "feature" | "wide" | "pair" | "editorial" | "platform";
  accent: "blue" | "teal" | "amber" | "rose" | "neutral";
  problem: string;
  built: string;
  stack: string[];
  /** The single verified result shown on the home card. */
  headline: Metric;
  metrics: Metric[];
  links: {
    github: string;
    live?: string;
    docs?: LinkRef[];
    paper?: string;
  };
  /** Honest attribution, e.g. team project. */
  contribution: string;
  architecture?: Architecture;
  decisions: Decision[];
  sections: CaseSection[];
  reliability: string[];
  charts?: ChartSeries[];
  findings?: Finding[];
  lessons: string[];
  caveats: string[];
  visual?: Visual;
  gallery?: Visual[];
  /** Relevance weights used by the role lens (0–3). */
  roles: Partial<Record<RoleId, number>>;
}

export interface LibraryProject {
  slug: string;
  name: string;
  summary: string;
  categories: Category[];
  year: number;
  stack: string[];
  metric?: Metric;
  github?: string;
  live?: string;
  paperId?: string;
  note?: string;
  roles: Partial<Record<RoleId, number>>;
}

export interface Publication {
  id: string;
  title: string;
  year: number;
  venue: string;
  venueShort: string;
  date: string;
  domain: string;
  contribution: string;
  methods: string[];
  doi: string;
  github?: string;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  org: string;
  role: string;
  location: string;
  start: string;
  end: string;
  kind: "primary" | "earlier";
  summary: string;
  systems?: { title: string; body: string; tags: string[]; roles: RoleId[] }[];
  highlights?: Metric[];
  bullets?: { text: string; roles: RoleId[] }[];
  stack: string[];
}

export interface SkillGroup {
  id: string;
  title: string;
  blurb: string;
  core: string[];
  more: string[];
  roles: RoleId[];
  evidence: string[];
}

export interface Award {
  id: string;
  title: string;
  detail: string;
  year: string;
  rank: string;
  context: string;
  href?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  location: string;
  period: string;
  detail: string;
  coursework?: string[];
  gpa?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issued: string;
  /** ISO date, for structured data. */
  issuedISO: string;
  expires?: string;
  summary: string;
  skills: string[];
  verifyUrl: string;
  badge: { src: string; alt: string; width: number; height: number };
}
