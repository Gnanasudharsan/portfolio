"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import type { SkillItem, SkillLayer, SkillUse } from "@/lib/skills";
import { cn } from "@/lib/cn";

/**
 * Skills as a layered system: each row is a layer of the stack, each skill a
 * text tag. Selecting a tag traces it — every skill used alongside it in the
 * same project or role lights up across all layers.
 */
export function SkillStack({ layers }: { layers: SkillLayer[] }) {
  const [active, setActive] = useState<string | null>(null);

  const all = useMemo(() => layers.flatMap((l) => l.skills), [layers]);
  const total = all.length;
  const shipped = all.filter((s) => s.uses.length > 0).length;

  const current = active ? all.find((s) => s.name === active) : undefined;
  const related = useMemo(() => {
    if (!current) return new Set<string>();
    const ids = new Set(current.uses.map((u) => u.id));
    return new Set(all.filter((s) => s.name !== current.name && s.uses.some((u) => ids.has(u.id))).map((s) => s.name));
  }, [current, all]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <div className="card mt-14 overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-mono text-[11.5px] tracking-wide text-fg-4 uppercase">
          The stack · top to bottom · {total} skills
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-fg-4">
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-6 rounded-[5px] border border-line-strong" aria-hidden /> Used in projects ({shipped})
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-6 rounded-[5px] border border-dashed border-line-strong" aria-hidden /> Coursework &amp; résumé
          </span>
        </div>
      </div>

      <ol className="relative">
        {/* the spine that joins the layers */}
        <span aria-hidden className="absolute top-0 bottom-0 left-[29px] hidden w-px bg-line sm:block" />
        {layers.map((layer, i) => {
          const linked = current ? layer.skills.filter((s) => related.has(s.name)).length : 0;
          const holdsActive = current ? layer.skills.some((s) => s.name === current.name) : false;
          return (
            <li
              key={layer.id}
              className={cn(
                "relative grid grid-cols-1 gap-3 border-t border-line px-5 py-5 first:border-t-0 sm:grid-cols-[230px_1fr] sm:gap-6 sm:pr-6 sm:pl-14",
                current && !holdsActive && linked === 0 && "opacity-75",
                "transition-opacity duration-200",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute top-[27px] left-[25px] hidden size-[9px] rounded-full border-2 border-bg sm:block",
                  holdsActive ? "bg-fg" : linked > 0 ? "bg-accent" : "bg-line-strong",
                )}
              />
              <div className="min-w-0">
                <p className="flex items-baseline gap-2 font-mono text-[11px] tracking-wide uppercase">
                  <span className="text-fg-4">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-accent">{layer.layer}</span>
                  {current && linked > 0 && (
                    <span className="text-[10.5px] text-fg-4 normal-case">· {linked} linked</span>
                  )}
                </p>
                <h3 className="mt-1 text-[15px] font-semibold">{layer.title}</h3>
                <p className="mt-1 hidden text-[13px] leading-relaxed text-fg-4 lg:block">{layer.blurb}</p>
              </div>

              <div className="min-w-0">
                <ul className="flex flex-wrap gap-1.5" aria-label={layer.title}>
                  {layer.skills.map((s) => (
                    <li key={s.name}>
                      <SkillTag
                        skill={s}
                        state={!current ? "idle" : s.name === current.name ? "active" : related.has(s.name) ? "related" : "muted"}
                        onSelect={() => setActive((a) => (a === s.name ? null : s.name))}
                      />
                    </li>
                  ))}
                </ul>
                {current && holdsActive && <Trace skill={current} related={related.size} onClose={() => setActive(null)} />}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="border-t border-line px-5 py-3 text-[12px] text-fg-4 sm:px-6" aria-live="polite">
        {current
          ? `${current.name}: used with ${related.size} other ${related.size === 1 ? "skill" : "skills"} across the stack.`
          : "Select any skill to trace where it was used and what it was used with."}
      </p>
    </div>
  );
}

function SkillTag({
  skill,
  state,
  onSelect,
}: {
  skill: SkillItem;
  state: "idle" | "active" | "related" | "muted";
  onSelect: () => void;
}) {
  const used = skill.uses.length > 0;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={state === "active"}
      className={cn(
        "inline-flex h-7 items-center rounded-md border px-2.5 text-[12.5px] transition-[color,background-color,border-color,opacity] duration-200",
        (state === "idle" || state === "muted") && (used ? "border-line" : "border-dashed border-line-strong"),
        state === "idle" && (used ? "text-fg-2 hover:border-line-strong hover:text-fg" : "text-fg-3 hover:text-fg"),
        state === "active" && "border-fg bg-fg text-bg",
        state === "related" && "border-accent/50 bg-accent-soft text-fg",
        state === "muted" && "text-fg-4 opacity-55 hover:opacity-100",
      )}
    >
      {skill.name}
    </button>
  );
}

const kindLabel: Record<SkillUse["kind"], string> = {
  case: "Case study",
  role: "Experience",
  project: "Project",
  cert: "Certification",
};

function Trace({ skill, related, onClose }: { skill: SkillItem; related: number; onClose: () => void }) {
  return (
    <div className="mt-4 rounded-lg border border-line bg-bg-subtle p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13.5px] text-fg-2">
          <span className="font-semibold text-fg">{skill.name}</span>
          {skill.uses.length > 0
            ? ` — used in ${skill.uses.length} ${skill.uses.length === 1 ? "place" : "places"}, alongside ${related} other ${related === 1 ? "skill" : "skills"} (highlighted).`
            : " — from coursework and my résumé; not yet part of a public project here."}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="-mt-1 -mr-1 grid size-7 shrink-0 place-items-center rounded-md text-fg-4 hover:bg-surface-2 hover:text-fg"
          aria-label="Clear selection"
        >
          <X size={14} />
        </button>
      </div>
      {skill.uses.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {skill.uses.map((u) => (
            <li key={u.id}>
              <UseTag use={u} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function UseTag({ use }: { use: SkillUse }) {
  const cls =
    "group inline-flex h-7 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 text-[12.5px] text-fg-2 hover:border-line-strong hover:text-fg";
  const inner = (
    <>
      <span className="font-mono text-[10px] text-fg-4 uppercase">{kindLabel[use.kind]}</span>
      {use.label}
      {use.href && <ArrowUpRight size={12} className="text-fg-4 group-hover:text-fg" aria-hidden />}
    </>
  );
  if (!use.href) return <span className={cls}>{inner}</span>;
  if (use.external)
    return (
      <a href={use.href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  return (
    <Link href={use.href} className={cls}>
      {inner}
    </Link>
  );
}
