"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useId, useMemo, useState } from "react";
import type { Category, Metric, ProjectStatus } from "@/data/types";
import { useRoleDefaultFilter } from "@/components/lens/role-lens";
import { cn } from "@/lib/cn";

export interface ExplorerItem {
  slug: string;
  name: string;
  summary: string;
  categories: Category[];
  year: number;
  stack: string[];
  metric?: Metric;
  href?: string;
  github?: string;
  live?: string;
  status?: ProjectStatus;
  note?: string;
  caseStudy: boolean;
}

const FILTERS: (Category | "All")[] = [
  "All",
  "AI / Agents",
  "ML Systems",
  "Data Engineering",
  "Data Science",
  "Analytics",
  "MLOps",
  "Research",
  "Computer Vision",
  "Full Stack",
  "IoT / Embedded",
];

export function ProjectExplorer({ items }: { items: ExplorerItem[] }) {
  const [filter, setFilter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const reduce = useReducedMotion();
  const searchId = useId();
  useRoleDefaultFilter(setFilter);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: items.length };
    for (const i of items) for (const cat of i.categories) c[cat] = (c[cat] ?? 0) + 1;
    return c;
  }, [items]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (filter !== "All" && !i.categories.includes(filter as Category)) return false;
      if (!q) return true;
      return `${i.name} ${i.summary} ${i.stack.join(" ")} ${i.categories.join(" ")}`.toLowerCase().includes(q);
    });
  }, [items, filter, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:px-0">
          <div role="group" aria-label="Filter by category" className="flex w-max gap-1.5 lg:w-auto lg:flex-wrap">
            {FILTERS.filter((f) => counts[f]).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13.5px] whitespace-nowrap transition-colors duration-150",
                  filter === f ? "border-fg bg-fg text-bg" : "border-line bg-surface text-fg-3 hover:border-line-strong hover:text-fg",
                )}
              >
                {f}
                <span className={cn("font-mono text-[11px]", filter === f ? "text-bg/70" : "text-fg-4")}>{counts[f]}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="relative w-full lg:w-72">
          <label htmlFor={searchId} className="sr-only">
            Search projects
          </label>
          <Search size={15} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-fg-4" aria-hidden />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or technology"
            className="h-11 w-full rounded-full border border-line bg-surface pr-10 pl-10 text-[14.5px] text-fg outline-none placeholder:text-fg-4 focus-visible:border-accent"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-1.5 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-fg-4 hover:text-fg"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <p className="mt-5 font-mono text-[12px] text-fg-4" aria-live="polite" data-testid="explorer-count">
        {shown.length} {shown.length === 1 ? "project" : "projects"}
        {filter !== "All" ? ` in ${filter}` : ""}
        {query ? ` matching “${query}”` : ""}
      </p>

      <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map((i) => (
            <motion.li
              key={i.slug}
              layout={reduce ? false : "position"}
              initial={reduce ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className="card group relative flex flex-col p-5 transition-colors hover:border-line-strong"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-fg-4">
                  {i.categories.slice(0, 2).join(" · ")} · {i.year}
                </span>
                {i.caseStudy && (
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[10px] text-accent">Case study</span>
                )}
              </div>
              <h3 className="mt-3 text-[16.5px] leading-snug font-semibold">
                {i.href ? (
                  <Link href={i.href} className="after:absolute after:inset-0 focus-visible:outline-none">
                    {i.name}
                  </Link>
                ) : (
                  i.name
                )}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-fg-3">{i.summary}</p>
              {i.metric && (
                <p className="mt-4 text-[13.5px] text-fg-2">
                  <span className="font-semibold text-fg tabular-nums">{i.metric.value}</span> {i.metric.label}
                  {i.metric.context && <span className="mt-0.5 block text-[12px] text-fg-4">{i.metric.context}</span>}
                </p>
              )}
              {i.note && <p className="mt-3 text-[12px] leading-snug text-fg-4">{i.note}</p>}
              <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4">
                <span className="font-mono text-[11px] text-fg-4">{i.stack.slice(0, 4).join(" · ")}</span>
                {i.github && (
                  <a
                    href={i.github}
                    target="_blank"
                    rel="noreferrer"
                    className="relative z-10 ml-auto inline-flex min-h-8 items-center gap-1 text-[12.5px] text-fg-3 hover:text-fg"
                    aria-label={`${i.name} source code (opens in new tab)`}
                  >
                    Code <ArrowUpRight size={12} aria-hidden />
                  </a>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {shown.length === 0 && (
        <div className="card mt-4 p-10 text-center">
          <p className="text-[15px] text-fg-2">Nothing matches that combination.</p>
          <button
            type="button"
            onClick={() => {
              setFilter("All");
              setQuery("");
            }}
            className="mt-3 text-[14px] text-accent hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
