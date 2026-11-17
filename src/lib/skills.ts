import { skillGroups } from "@/data/skills";
import { projects } from "@/data/projects";
import { library } from "@/data/library";
import { experience } from "@/data/experience";
import { certifications } from "@/data/certifications";
import type { SkillSpec } from "@/data/types";

export interface SkillUse {
  /** Source id — project slug, experience id or certification id. */
  id: string;
  kind: "case" | "project" | "role" | "cert";
  label: string;
  href?: string;
  external?: boolean;
}

export interface SkillItem {
  name: string;
  uses: SkillUse[];
}

export interface SkillCategory {
  id: string;
  title: string;
  blurb: string;
  skills: SkillItem[];
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

interface Source {
  stack: string[];
  use: SkillUse;
}

function sources(): Source[] {
  const caseSlugs = new Set(projects.map((p) => p.slug));
  return [
    ...projects.map((p) => ({
      stack: p.stack,
      use: { id: p.slug, kind: "case" as const, label: p.short, href: `/work/${p.slug}` },
    })),
    ...library
      .filter((l) => !caseSlugs.has(l.slug))
      .map((l) => {
        const href = l.live ?? l.github;
        return { stack: l.stack, use: { id: l.slug, kind: "project" as const, label: l.name, href, external: Boolean(href) } };
      }),
    ...experience.map((e) => ({
      stack: e.stack,
      use: { id: e.id, kind: "role" as const, label: e.org, href: "/#experience" },
    })),
    ...certifications.map((c) => ({
      stack: c.skills,
      use: { id: c.id, kind: "cert" as const, label: "Claude Certified Architect", href: c.verifyUrl, external: true },
    })),
  ];
}

const spec = (s: SkillSpec) => (typeof s === "string" ? { n: s } : s);
const order = { case: 0, role: 1, project: 2, cert: 3 };

/** Every skill with the places it was used, computed from project / role / certification data. */
export function buildSkillCategories(): SkillCategory[] {
  const src = sources();
  const byId = new Map(src.map((s) => [s.use.id, s]));

  return skillGroups.map((g) => ({
    id: g.id,
    title: g.title,
    blurb: g.blurb,
    skills: g.skills.map((raw) => {
      const s = spec(raw);
      const names = new Set([s.n, ...(s.a ?? [])].map(norm));
      const uses = new Map<string, SkillUse>();
      for (const source of src) if (source.stack.some((t) => names.has(norm(t)))) uses.set(source.use.id, source.use);
      for (const id of s.in ?? []) {
        const source = byId.get(id);
        if (source) uses.set(id, source.use);
      }
      return { name: s.n, uses: [...uses.values()].sort((a, b) => order[a.kind] - order[b.kind]) };
    }),
  }));
}

/** Ids referenced by `in` that don't resolve — used by tests. */
export function unresolvedSkillRefs(): string[] {
  const ids = new Set(sources().map((s) => s.use.id));
  return skillGroups.flatMap((g) => g.skills.flatMap((s) => (spec(s).in ?? []).filter((id) => !ids.has(id))));
}
