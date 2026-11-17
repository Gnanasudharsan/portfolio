"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, LayoutGroup, motion, type Variants } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Brain,
  ChartColumn,
  Cloud,
  CodeXml,
  Database,
  Infinity as InfinityIcon,
  Sigma,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { SkillCategory, SkillUse } from "@/lib/skills";
import { cn } from "@/lib/cn";

const icons: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  ai: Sparkles,
  ml: Brain,
  "data-sci": Sigma,
  data: Workflow,
  stores: Database,
  mlops: InfinityIcon,
  cloud: Cloud,
  analytics: ChartColumn,
  backend: CodeXml,
};

const ease = [0.22, 1, 0.36, 1] as const;
const morph = { type: "spring", stiffness: 340, damping: 36, mass: 0.8 } as const;

const tagList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.018, delayChildren: 0.14 } },
};
const tagItem: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.32, ease } },
};

const kindLabel: Record<SkillUse["kind"], string> = {
  case: "Case study",
  role: "Experience",
  project: "Project",
  cert: "Certification",
};

/**
 * Skills by category. The overview shows every category as a card; selecting
 * one morphs that card into a panel listing all of its skills.
 */
export function SkillCategories({ categories }: { categories: SkillCategory[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const lastOpen = useRef<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLButtonElement>());
  const headingRef = useRef<HTMLHeadingElement>(null);

  const total = categories.reduce((n, c) => n + c.skills.length, 0);
  const idx = open ? categories.findIndex((c) => c.id === open) : -1;
  const cat = idx >= 0 ? categories[idx] : null;

  // Move focus with the view: into the panel on open, back to the card on close.
  useEffect(() => {
    if (open) {
      headingRef.current?.focus({ preventScroll: true });
      lastOpen.current = open;
      const top = rootRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) rootRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    } else if (lastOpen.current) {
      cardRefs.current.get(lastOpen.current)?.focus({ preventScroll: true });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={rootRef} className="mt-14 scroll-mt-28">
      <LayoutGroup>
        <AnimatePresence mode="popLayout" initial={false}>
          {cat ? (
            <Panel
              key={`panel-${cat.id}`}
              cat={cat}
              index={idx}
              count={categories.length}
              headingRef={headingRef}
              onBack={() => setOpen(null)}
              onPrev={() => setOpen(categories[(idx - 1 + categories.length) % categories.length].id)}
              onNext={() => setOpen(categories[(idx + 1) % categories.length].id)}
              prevTitle={categories[(idx - 1 + categories.length) % categories.length].title}
              nextTitle={categories[(idx + 1) % categories.length].title}
            />
          ) : (
            <motion.ul
              key="grid"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.25 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {categories.map((c, i) => {
                const Icon = icons[c.id] ?? Sparkles;
                return (
                  <li key={c.id}>
                    <motion.button
                      layoutId={`cat-${c.id}`}
                      transition={morph}
                      ref={(el) => {
                        if (el) cardRefs.current.set(c.id, el);
                      }}
                      type="button"
                      onClick={() => setOpen(c.id)}
                      aria-expanded={false}
                      className="group card relative flex h-full w-full flex-col p-5 text-left transition-colors hover:border-line-strong"
                      style={{ borderRadius: 16 }}
                    >
                      <motion.div layout="position" className="flex items-center justify-between">
                        <span className="grid size-10 place-items-center rounded-xl border border-line bg-bg-subtle text-accent">
                          <Icon size={18} />
                        </span>
                        <span className="font-mono text-[11px] text-fg-4">{String(i + 1).padStart(2, "0")}</span>
                      </motion.div>
                      <motion.div layout="position" className="mt-4">
                        <h3 className="text-[16.5px] font-semibold tracking-tight">{c.title}</h3>
                        <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-fg-3">{c.blurb}</p>
                      </motion.div>
                      <motion.div layout="position" className="mt-4 flex flex-wrap gap-1.5" aria-hidden>
                        {c.skills.slice(0, 4).map((s) => (
                          <span key={s.name} className="rounded-md border border-line px-2 py-0.5 text-[12px] text-fg-3">
                            {s.name}
                          </span>
                        ))}
                        {c.skills.length > 4 && (
                          <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[12px] text-fg-4">+{c.skills.length - 4}</span>
                        )}
                      </motion.div>
                      <motion.span layout="position" className="mt-auto flex items-center justify-between pt-5 text-[12.5px] text-fg-4">
                        <span>{c.skills.length} skills</span>
                        <span className="inline-flex items-center gap-1 text-fg-3 transition-colors group-hover:text-fg">
                          View all
                          <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                        </span>
                      </motion.span>
                    </motion.button>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </LayoutGroup>
      <p className="mt-4 font-mono text-[11px] text-fg-4" aria-live="polite">
        {cat ? `${cat.title} · ${cat.skills.length} skills · Esc to go back` : `${categories.length} categories · ${total} skills`}
      </p>
    </div>
  );
}

function Panel({
  cat,
  index,
  count,
  headingRef,
  onBack,
  onPrev,
  onNext,
  prevTitle,
  nextTitle,
}: {
  cat: SkillCategory;
  index: number;
  count: number;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
  prevTitle: string;
  nextTitle: string;
}) {
  const Icon = icons[cat.id] ?? Sparkles;
  const used = cat.skills.filter((s) => s.uses.length > 0).length;

  // Every place this category's skills were used, most-used first.
  const places = useMemo(() => {
    const m = new Map<string, { use: SkillUse; n: number }>();
    for (const s of cat.skills) for (const u of s.uses) m.set(u.id, { use: u, n: (m.get(u.id)?.n ?? 0) + 1 });
    return [...m.values()].sort((a, b) => b.n - a.n);
  }, [cat]);

  return (
    <motion.section
      layoutId={`cat-${cat.id}`}
      transition={morph}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      className="card overflow-hidden"
      style={{ borderRadius: 16 }}
      aria-labelledby={`skills-cat-${cat.id}`}
    >
      <motion.div layout="position" className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          className="-ml-2 inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-[13px] text-fg-3 hover:bg-surface-2 hover:text-fg"
        >
          <ArrowLeft size={14} /> All categories
        </button>
        <div className="flex items-center gap-1">
          <span className="mr-2 font-mono text-[11px] text-fg-4">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={onPrev}
            className="grid size-8 place-items-center rounded-md border border-line text-fg-3 hover:border-line-strong hover:text-fg"
            aria-label={`Previous category: ${prevTitle}`}
          >
            <ArrowLeft size={14} />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="grid size-8 place-items-center rounded-md border border-line text-fg-3 hover:border-line-strong hover:text-fg"
            aria-label={`Next category: ${nextTitle}`}
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>

      <motion.div layout="position" className="grid grid-cols-1 gap-8 p-5 sm:p-6 lg:grid-cols-12 lg:gap-10">
        <motion.div
          className="lg:col-span-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease, delay: 0.08 } }}
        >
          <span className="grid size-12 place-items-center rounded-2xl border border-line bg-bg-subtle text-accent">
            <Icon size={22} />
          </span>
          <h3
            ref={headingRef}
            id={`skills-cat-${cat.id}`}
            tabIndex={-1}
            className="mt-5 text-[24px] leading-tight font-semibold tracking-tight outline-none sm:text-[28px]"
          >
            {cat.title}
          </h3>
          <p className="mt-3 text-[14.5px] leading-relaxed text-fg-3">{cat.blurb}</p>
          <dl className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-line px-3 py-2.5">
              <dt className="font-mono text-[10.5px] tracking-wide text-fg-4 uppercase">Skills</dt>
              <dd className="mt-0.5 text-[20px] font-semibold">{cat.skills.length}</dd>
            </div>
            <div className="rounded-lg border border-line px-3 py-2.5">
              <dt className="font-mono text-[10.5px] tracking-wide text-fg-4 uppercase">In projects</dt>
              <dd className="mt-0.5 text-[20px] font-semibold">{used}</dd>
            </div>
          </dl>
        </motion.div>

        <div className="min-w-0 lg:col-span-8">
          <motion.ul
            className="flex flex-wrap gap-2"
            variants={tagList}
            initial="hidden"
            animate="show"
            aria-label={`${cat.title} skills`}
          >
            {cat.skills.map((s) => (
              <motion.li key={s.name} variants={tagItem}>
                <span
                  title={s.uses.length ? `Used in ${s.uses.map((u) => u.label).join(", ")}` : "Coursework & résumé"}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-[13px]",
                    s.uses.length ? "border-line bg-surface text-fg-2" : "border-dashed border-line-strong text-fg-3",
                  )}
                >
                  {s.name}
                  {s.uses.length > 0 && <span className="font-mono text-[10.5px] text-fg-4">{s.uses.length}</span>}
                </span>
              </motion.li>
            ))}
          </motion.ul>
          <p className="mt-3 text-[12px] text-fg-4">
            Number = places used on this site · dashed = coursework &amp; résumé
          </p>

          {places.length > 0 && (
            <motion.div
              className="mt-7 border-t border-line pt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.35, duration: 0.4 } }}
            >
              <p className="font-mono text-[11px] tracking-wide text-fg-4 uppercase">Where these skills were used</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {places.map(({ use }) => (
                  <li key={use.id}>
                    <UseTag use={use} />
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.section>
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
