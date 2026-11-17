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
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {categories.map((c, i) => (
                <li key={c.id}>
                  <FlipCard
                    cat={c}
                    index={i}
                    onOpen={() => setOpen(c.id)}
                    buttonRef={(el) => {
                      if (el) cardRefs.current.set(c.id, el);
                    }}
                  />
                </li>
              ))}
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

const flipSpring = { type: "spring", stiffness: 170, damping: 22, mass: 1 } as const;

/**
 * A category card: the front shows only the category name; hovering (or
 * keyboard focus) flips it to preview its skills, and clicking zooms it open.
 * Touch devices skip the flip — a tap opens the category directly.
 */
function FlipCard({
  cat,
  index,
  onOpen,
  buttonRef,
}: {
  cat: SkillCategory;
  index: number;
  onOpen: () => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const Icon = icons[cat.id] ?? Sparkles;
  const preview = cat.skills.slice(0, 9);
  const more = cat.skills.length - preview.length;
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.button
      layoutId={`cat-${cat.id}`}
      transition={morph}
      ref={buttonRef}
      type="button"
      onClick={onOpen}
      onHoverStart={() => setFlipped(true)}
      onHoverEnd={() => setFlipped(false)}
      onFocus={(e) => setFlipped(e.currentTarget.matches(":focus-visible"))}
      onBlur={() => setFlipped(false)}
      whileTap={{ scale: 0.97 }}
      aria-expanded={false}
      aria-label={`${cat.title}, ${cat.skills.length} skills`}
      className="relative block h-[208px] w-full text-left outline-none [perspective:1100px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      style={{ borderRadius: 16 }}
    >
      <motion.div
        className="relative size-full [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0, y: flipped ? -4 : 0 }}
        transition={flipSpring}
      >
        {/* Front — just the category */}
        <div className="card absolute inset-0 flex flex-col justify-between overflow-hidden p-5 [backface-visibility:hidden]" style={{ borderRadius: 16 }}>
          <div className="flex items-center justify-between">
            <span className="grid size-11 place-items-center rounded-xl border border-line bg-bg-subtle text-accent">
              <Icon size={20} />
            </span>
            <span className="font-mono text-[11px] text-fg-4">{num}</span>
          </div>
          <div>
            <h3 className="text-[21px] leading-tight font-semibold tracking-tight">{cat.title}</h3>
            <p className="mt-1.5 font-mono text-[11px] text-fg-4">{cat.skills.length} skills</p>
          </div>
        </div>

        {/* Back — skill preview */}
        <div
          aria-hidden
          className="absolute inset-0 flex flex-col overflow-hidden border border-accent/40 bg-surface p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ borderRadius: 16 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[13.5px] font-semibold tracking-tight">{cat.title}</span>
            <Icon size={16} className="text-accent" />
          </div>
          <div className="mt-3 flex flex-wrap content-start gap-1.5 overflow-hidden">
            {preview.map((s) => (
              <span key={s.name} className="rounded-md border border-line bg-bg-subtle px-2 py-0.5 text-[12px] text-fg-2">
                {s.name}
              </span>
            ))}
            {more > 0 && <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[12px] text-fg-4">+{more}</span>}
          </div>
          <span className="mt-auto inline-flex items-center gap-1 pt-3 text-[12.5px] font-medium text-accent">
            Open <ArrowRight size={13} />
          </span>
        </div>
      </motion.div>
    </motion.button>
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
          <dl className="mt-5 grid grid-cols-2 gap-3">
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
