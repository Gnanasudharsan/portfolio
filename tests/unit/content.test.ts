import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_FEATURED, projects } from "@/data/projects";
import { library } from "@/data/library";
import { roles } from "@/data/roles";
import { skillGroups } from "@/data/skills";
import { publications } from "@/data/research";
import { PROJECT_SLUGS } from "@/data/project-slugs";

const slugs = new Set(projects.map((p) => p.slug));

describe("projects", () => {
  it("have unique slugs", () => {
    expect(slugs.size).toBe(projects.length);
    const lib = library.map((l) => l.slug);
    expect(new Set([...slugs, ...lib]).size).toBe(projects.length + lib.length);
  });

  it("match the slug list the 404 proxy uses", () => {
    expect([...PROJECT_SLUGS].sort()).toEqual([...slugs].sort());
  });

  it("cite a source for every measured or target metric", () => {
    for (const p of projects) {
      for (const m of [p.headline, ...p.metrics]) {
        if (m.kind !== "reported") expect(m.source, `${p.slug}: ${m.label}`).toBeTruthy();
      }
    }
  });

  it("never claim Production status (no project here has production users)", () => {
    for (const p of projects) expect(p.status).not.toBe("Production");
  });

  it("only link visuals that exist on disk", () => {
    for (const p of projects) {
      for (const v of [p.visual, ...(p.gallery ?? [])].filter(Boolean)) {
        const file = join(process.cwd(), "public", v!.src);
        expect(existsSync(file), v!.src).toBe(true);
        expect(v!.alt.length, `${v!.src} alt text`).toBeGreaterThan(30);
      }
    }
  });

  it("keep architecture edges pointing at real nodes", () => {
    for (const p of projects) {
      if (!p.architecture) continue;
      const ids = new Set(p.architecture.nodes.map((n) => n.id));
      for (const e of p.architecture.edges) {
        expect(ids.has(e.from) && ids.has(e.to), `${p.slug}: ${e.from}→${e.to}`).toBe(true);
      }
      for (const n of p.architecture.nodes) expect(n.layer).toBeLessThan(p.architecture.layers.length);
    }
  });

  it("credit collaborators on team and forked work", () => {
    expect(projects.find((p) => p.slug === "ask-the-mesh")!.contribution).toMatch(/Sreevarshann/);
    expect(projects.find((p) => p.slug === "charlie")!.contribution).toMatch(/Team project/);
  });
});

describe("role lens", () => {
  it("orders only real projects and fills the eight homepage slots", () => {
    expect(DEFAULT_FEATURED).toHaveLength(8);
    for (const s of DEFAULT_FEATURED) expect(slugs.has(s), s).toBe(true);
    for (const r of roles) {
      expect(r.order.length, r.id).toBeGreaterThanOrEqual(8);
      expect(new Set(r.order).size).toBe(r.order.length);
      for (const s of r.order) expect(slugs.has(s), `${r.id}: ${s}`).toBe(true);
      for (const g of r.skills) expect(skillGroups.some((sg) => sg.id === g), `${r.id}: ${g}`).toBe(true);
    }
  });

  it("links skill evidence to real projects", () => {
    for (const g of skillGroups) for (const e of g.evidence) expect(slugs.has(e), `${g.id}: ${e}`).toBe(true);
  });
});

describe("research", () => {
  it("lists ten IEEE papers with well-formed DOIs", () => {
    expect(publications).toHaveLength(10);
    for (const p of publications) expect(p.doi).toMatch(/^10\.1109\/[A-Za-z0-9-]+\.\d{4}\.\d+$/);
    expect(new Set(publications.map((p) => p.doi)).size).toBe(10);
  });
});

describe("privacy", () => {
  it("never publishes a phone number", () => {
    const walk = (d: string): string[] =>
      readdirSync(d).flatMap((f) => {
        const p = join(d, f);
        return statSync(p).isDirectory() ? walk(p) : [p];
      });
    for (const f of walk(join(process.cwd(), "src"))) {
      expect(readFileSync(f, "utf8"), f).not.toMatch(/\+?1?[-\s.(]*857[-\s.)]*\d{3}[-\s.]*\d{4}/);
    }
  });
});
