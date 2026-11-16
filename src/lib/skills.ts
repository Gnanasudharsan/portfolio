import { skillGroups } from "@/data/skills";
import { projects } from "@/data/projects";
import { library } from "@/data/library";
import { experience } from "@/data/experience";
import { certifications } from "@/data/certifications";
import type { SkillSpec } from "@/data/types";

export interface SkillUse {
  kind: "case" | "project" | "role" | "cert";
  label: string;
  detail?: string;
  href?: string;
  external?: boolean;
}

export interface SkillElement {
  /** Atomic number — position in the table. */
  z: number;
  name: string;
  symbol: string;
  group: string;
  uses: SkillUse[];
}

export interface SkillFamily {
  id: string;
  title: string;
  short: string;
  hue: number;
  blurb: string;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

interface Source {
  id: string;
  stack: string[];
  use: SkillUse;
}

function sources(): Source[] {
  const caseSlugs = new Set(projects.map((p) => p.slug));
  return [
    ...projects.map((p) => ({
      id: p.slug,
      stack: p.stack,
      use: { kind: "case" as const, label: p.short, detail: p.tagline, href: `/work/${p.slug}` },
    })),
    ...library
      .filter((l) => !caseSlugs.has(l.slug))
      .map((l) => {
        const href = l.live ?? l.github;
        return {
          id: l.slug,
          stack: l.stack,
          use: { kind: "project" as const, label: l.name, detail: String(l.year), href, external: Boolean(href) },
        };
      }),
    ...experience.map((e) => ({
      id: e.id,
      stack: e.stack,
      use: { kind: "role" as const, label: e.org, detail: e.role, href: "/#experience" },
    })),
    ...certifications.map((c) => ({
      id: c.id,
      stack: c.skills,
      use: { kind: "cert" as const, label: c.name, detail: c.issuer, href: c.verifyUrl, external: true },
    })),
  ];
}

/** Periodic-table style symbol: acronyms stay as-is, otherwise Xy. */
function baseSymbol(name: string): string {
  const words = name.split(/[\s/\-.]+/).filter(Boolean);
  const first = words[0];
  if (/^[A-Z0-9]{2,4}$/.test(first) && words.length === 1) return first;
  if (words.length >= 2) {
    return (words[0][0].toUpperCase() + words[1][0].toLowerCase()).replace(/[^A-Za-z0-9]/g, "");
  }
  const caps = first.match(/[A-Z]/g);
  if (caps && caps.length >= 2) return caps[0] + caps[1].toLowerCase();
  return first[0].toUpperCase() + first[1].toLowerCase();
}

function uniqueSymbol(name: string, taken: Set<string>): string {
  let sym = baseSymbol(name);
  if (!taken.has(sym)) return sym;
  const letters = name.replace(/[^A-Za-z0-9]/g, "");
  for (let i = 1; i < letters.length; i++) {
    sym = letters[0].toUpperCase() + letters[i].toLowerCase();
    if (!taken.has(sym)) return sym;
  }
  for (let i = 1; i < letters.length - 1; i++) {
    sym = letters[0].toUpperCase() + letters[i].toLowerCase() + letters[i + 1].toLowerCase();
    if (!taken.has(sym)) return sym;
  }
  return letters.slice(0, 3);
}

const spec = (s: SkillSpec) => (typeof s === "string" ? { n: s } : s);

export function buildSkillTable(): { families: SkillFamily[]; elements: SkillElement[] } {
  const src = sources();
  const byId = new Map(src.map((s) => [s.id, s]));
  const taken = new Set<string>();
  const elements: SkillElement[] = [];
  let z = 0;

  for (const g of skillGroups) {
    for (const raw of g.skills) {
      const s = spec(raw);
      const names = new Set([s.n, ...(s.a ?? [])].map(norm));
      const seen = new Set<string>();
      const uses: SkillUse[] = [];
      const push = (source: Source | undefined) => {
        if (!source || seen.has(source.id)) return;
        seen.add(source.id);
        uses.push(source.use);
      };
      for (const source of src) if (source.stack.some((t) => names.has(norm(t)))) push(source);
      for (const id of s.in ?? []) push(byId.get(id));

      const order = { case: 0, role: 1, project: 2, cert: 3 };
      uses.sort((a, b) => order[a.kind] - order[b.kind]);

      const symbol = uniqueSymbol(s.n, taken);
      taken.add(symbol);
      elements.push({ z: ++z, name: s.n, symbol, group: g.id, uses });
    }
  }

  return {
    families: skillGroups.map(({ id, title, short, hue, blurb }) => ({ id, title, short, hue, blurb })),
    elements,
  };
}

/** Ids referenced by `in` that don't resolve — used by tests. */
export function unresolvedSkillRefs(): string[] {
  const ids = new Set(sources().map((s) => s.id));
  return skillGroups.flatMap((g) => g.skills.flatMap((s) => (spec(s).in ?? []).filter((id) => !ids.has(id))));
}
