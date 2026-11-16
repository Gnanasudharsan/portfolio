"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import type { SkillElement, SkillFamily, SkillUse } from "@/lib/skills";
import { cn } from "@/lib/cn";

const kindLabel: Record<SkillUse["kind"], string> = {
  case: "Case studies",
  role: "Experience",
  project: "Projects",
  cert: "Certification",
};

const hueStyle = (hue: number) => ({ "--h": hue }) as CSSProperties;

export function SkillTable({ families, elements }: { families: SkillFamily[]; elements: SkillElement[] }) {
  const famById = useMemo(() => new Map(families.map((f) => [f.id, f])), [families]);
  const initial = useMemo(
    () => elements.reduce((best, e) => (e.uses.length > best.uses.length ? e : best), elements[0]),
    [elements],
  );
  const [active, setActive] = useState<number>(initial.z);
  const [family, setFamily] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  // On phones, 140+ tiles is a long scroll — open on the first family instead.
  useEffect(() => {
    const first = families[0].id;
    const frame = requestAnimationFrame(() => {
      if (!window.matchMedia("(max-width: 1023px)").matches) return;
      setFamily((f) => f ?? first);
      setActive((z) => (elements.find((e) => e.z === z)?.group === first ? z : elements.find((e) => e.group === first)!.z));
    });
    return () => cancelAnimationFrame(frame);
  }, [families, elements]);

  const q = query.trim().toLowerCase();
  const matches = (e: SkillElement) =>
    (!family || e.group === family) && (!q || e.name.toLowerCase().includes(q) || e.symbol.toLowerCase() === q);
  const visibleCount = elements.filter(matches).length;
  const shipped = elements.filter((e) => e.uses.length > 0).length;

  const el = elements.find((e) => e.z === active) ?? initial;
  const fam = famById.get(el.group)!;
  const grouped = (Object.keys(kindLabel) as SkillUse["kind"][])
    .map((k) => ({ kind: k, items: el.uses.filter((u) => u.kind === k) }))
    .filter((g) => g.items.length);

  const pickFamily = (id: string | null) => {
    setFamily(id);
    if (id && el.group !== id) {
      const first = elements.find((e) => e.group === id);
      if (first) setActive(first.z);
    }
  };

  // Roving focus: one tab stop for the whole table, arrows move between tiles.
  const onKeyDown = (ev: KeyboardEvent<HTMLButtonElement>) => {
    const tiles = Array.from(gridRef.current?.querySelectorAll<HTMLButtonElement>("button[data-z]") ?? []);
    const i = tiles.indexOf(ev.currentTarget);
    if (i < 0) return;
    const top = tiles[0].offsetTop;
    const firstWrap = tiles.findIndex((t) => t.offsetTop !== top);
    const cols = firstWrap < 0 ? tiles.length : firstWrap;
    const step: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols };
    let next = -1;
    if (ev.key in step) next = Math.min(tiles.length - 1, Math.max(0, i + step[ev.key]));
    else if (ev.key === "Home") next = 0;
    else if (ev.key === "End") next = tiles.length - 1;
    if (next < 0) return;
    ev.preventDefault();
    tiles[next].focus();
    setActive(Number(tiles[next].dataset.z));
  };

  return (
    <div className="mt-12">
      {/* Toolbar: search + family legend */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by family">
          <button
            type="button"
            onClick={() => pickFamily(null)}
            aria-pressed={family === null}
            className={cn(
              "inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] transition-colors",
              family === null ? "border-fg bg-fg text-bg" : "border-line text-fg-3 hover:border-line-strong hover:text-fg",
            )}
          >
            All <span className="ml-1.5 font-mono text-[11px] opacity-70">{elements.length}</span>
          </button>
          {families.map((f) => {
            const on = family === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => pickFamily(on ? null : f.id)}
                aria-pressed={on}
                style={hueStyle(f.hue)}
                className={cn("sk-chip inline-flex h-8 items-center gap-2 rounded-full border px-3 text-[12.5px] transition-colors", on && "sk-chip-on")}
              >
                <span className="sk-dot size-2 rounded-full" aria-hidden />
                {f.short}
              </button>
            );
          })}
        </div>
        <label className="relative flex h-9 w-full shrink-0 items-center lg:w-60">
          <span className="sr-only">Find a skill</span>
          <Search size={14} className="pointer-events-none absolute left-3 text-fg-4" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a skill…"
            className="h-9 w-full rounded-full border border-line bg-surface pr-8 pl-8 text-[13px] text-fg placeholder:text-fg-4 focus:border-line-strong focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 grid size-6 place-items-center rounded-full text-fg-4 hover:text-fg"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </label>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Detail card */}
        <aside className="lg:order-2 lg:col-span-4" aria-live="polite">
          <div className="card lg:sticky lg:top-24" style={hueStyle(fam.hue)}>
            <div className="flex items-start gap-4 p-5">
              <div className="sk-tile sk-big relative grid size-[88px] shrink-0 place-items-center rounded-xl border">
                <span className="absolute top-1.5 left-2 font-mono text-[10px] text-fg-4">{el.z}</span>
                <span className="sk-ink text-[30px] leading-none font-semibold tracking-tight">{el.symbol}</span>
              </div>
              <div className="min-w-0 pt-1">
                <p className="sk-ink font-mono text-[11px] tracking-wide uppercase">{fam.title}</p>
                <h3 className="mt-1 text-[20px] leading-tight font-semibold tracking-tight">{el.name}</h3>
                <p className="mt-1.5 text-[12.5px] text-fg-4">
                  {el.uses.length > 0
                    ? `Used in ${el.uses.length} ${el.uses.length === 1 ? "place" : "places"} on this site`
                    : "From my coursework and résumé"}
                </p>
              </div>
            </div>
            <p className="border-t border-line px-5 py-4 text-[13.5px] leading-relaxed text-fg-3">{fam.blurb}</p>
            {grouped.length > 0 ? (
              <div className="max-h-[22rem] overflow-y-auto border-t border-line px-5 py-4">
                {grouped.map((g) => (
                  <div key={g.kind} className="not-first:mt-4">
                    <p className="font-mono text-[10.5px] tracking-wide text-fg-4 uppercase">{kindLabel[g.kind]}</p>
                    <ul className="mt-2 space-y-1">
                      {g.items.map((u) => (
                        <li key={u.label}>
                          <UseLink use={u} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="border-t border-line px-5 py-4 text-[13px] text-fg-4">
                Not yet part of a public project here.
              </p>
            )}
          </div>
        </aside>

        {/* The table */}
        <div className="lg:order-1 lg:col-span-8">
          <div
            ref={gridRef}
            className="grid grid-cols-[repeat(auto-fill,minmax(58px,1fr))] gap-1.5 sm:grid-cols-[repeat(auto-fill,minmax(64px,1fr))]"
            role="group"
            aria-label="Skills table — use arrow keys to move between skills"
          >
            {elements.map((e) => {
              const f = famById.get(e.group)!;
              const on = e.z === el.z;
              const dim = !matches(e);
              return (
                <button
                  key={e.z}
                  type="button"
                  data-z={e.z}
                  tabIndex={on ? 0 : -1}
                  aria-pressed={on}
                  aria-label={`${e.name}, ${f.title}${e.uses.length ? `, used in ${e.uses.length}` : ""}`}
                  title={e.name}
                  onClick={() => setActive(e.z)}
                  onFocus={() => setActive(e.z)}
                  onKeyDown={onKeyDown}
                  style={hueStyle(f.hue)}
                  className={cn("sk-tile relative flex aspect-square flex-col items-center justify-center rounded-lg border px-1", on && "sk-on", dim && "sk-dim")}
                >
                  <span className="absolute top-1 left-1.5 font-mono text-[8.5px] leading-none text-fg-4">{e.z}</span>
                  {e.uses.length > 0 && (
                    <span className="sk-ink absolute top-1 right-1.5 font-mono text-[8.5px] leading-none">{e.uses.length}</span>
                  )}
                  <span className="sk-ink text-[17px] leading-none font-semibold tracking-tight">{e.symbol}</span>
                  <span className="mt-1 w-full truncate text-center text-[8.5px] leading-tight text-fg-3">{e.name}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-fg-4">
            <span>
              {visibleCount === elements.length ? `${elements.length} skills` : `${visibleCount} of ${elements.length} skills`} · {families.length} families
            </span>
            <span>{shipped} used in projects, roles or certifications on this site</span>
            <span className="hidden sm:inline">Corner number = places used</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function UseLink({ use }: { use: SkillUse }) {
  const inner = (
    <>
      <span className="min-w-0">
        <span className="block truncate text-[13.5px] text-fg-2 group-hover:text-fg">{use.label}</span>
        {use.detail && <span className="block truncate text-[12px] text-fg-4">{use.detail}</span>}
      </span>
      {use.href && <ArrowUpRight size={13} className="mt-1 shrink-0 text-fg-4 group-hover:text-fg" aria-hidden />}
    </>
  );
  const cls = "group -mx-2 flex items-start justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-surface-2";
  if (!use.href) return <div className={cls}>{inner}</div>;
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
