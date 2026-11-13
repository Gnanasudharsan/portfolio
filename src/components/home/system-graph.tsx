"use client";

import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Signature interaction: six disciplines, and every connecting line is a real
 * project that sits between two of them. Focus or hover a discipline to see
 * which projects join it to the rest.
 */

type NodeId = "ai" | "data" | "ml" | "mlops" | "analytics" | "research";

const NODES: { id: NodeId; label: string; x: number; y: number }[] = [
  { id: "ai", label: "AI systems", x: 50, y: 10 },
  { id: "data", label: "Data platforms", x: 80, y: 30 },
  { id: "analytics", label: "Analytics", x: 80, y: 74 },
  { id: "research", label: "Research", x: 50, y: 92 },
  { id: "ml", label: "Machine learning", x: 21, y: 74 },
  { id: "mlops", label: "MLOps", x: 20, y: 30 },
];

const EDGES: { a: NodeId; b: NodeId; slug: string; name: string }[] = [
  { a: "ai", b: "data", slug: "helio", name: "Helio" },
  { a: "ai", b: "research", slug: "ramp", name: "Ramp" },
  { a: "ai", b: "mlops", slug: "ask-the-mesh", name: "Ask the Mesh" },
  { a: "data", b: "analytics", slug: "aeropulse", name: "AeroPulse" },
  { a: "analytics", b: "ai", slug: "dockline", name: "Dockline" },
  { a: "analytics", b: "research", slug: "cordon", name: "Cordon" },
  { a: "ml", b: "mlops", slug: "charlie", name: "Charlie" },
  { a: "ml", b: "research", slug: "gpu-lab", name: "GPU Lab" },
  { a: "data", b: "ml", slug: "ledgerline", name: "Ledgerline" },
  { a: "data", b: "mlops", slug: "tidewater", name: "Tidewater" },
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<NodeId, (typeof NODES)[number]>;

export function SystemGraph({ className }: { className?: string }) {
  const [focus, setFocus] = useState<NodeId | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = wrap.current;
    if (!el || reduce || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const dx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const dy = ((e.clientY - r.top) / r.height - 0.5) * 2;
        el.style.setProperty("--px", `${Math.max(-1, Math.min(1, dx)).toFixed(3)}`);
        el.style.setProperty("--py", `${Math.max(-1, Math.min(1, dy)).toFixed(3)}`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduce]);

  const active = focus ? EDGES.filter((e) => e.a === focus || e.b === focus) : [];
  const activeSlugs = new Set(active.map((e) => e.slug));

  return (
    <div className={cn("relative select-none", className)} onMouseLeave={() => setFocus(null)}>
      <div
        ref={wrap}
        className="relative aspect-square w-full [--px:0] [--py:0]"
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <defs>
            <radialGradient id="sg-fade" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.10" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="51" r="44" fill="url(#sg-fade)" />
          <circle cx="50" cy="51" r="41" fill="none" stroke="var(--line)" strokeWidth="0.25" strokeDasharray="0.6 1.4" />
          <g
            style={{
              transform: "translate(calc(var(--px) * 0.9px), calc(var(--py) * 0.9px))",
              transition: "transform 400ms var(--ease-out-quart)",
            }}
          >
            {EDGES.map((e) => {
              const a = byId[e.a];
              const b = byId[e.b];
              const on = activeSlugs.has(e.slug);
              const mx = (a.x + b.x) / 2 + (50 - (a.x + b.x) / 2) * 0.18;
              const my = (a.y + b.y) / 2 + (51 - (a.y + b.y) / 2) * 0.18;
              return (
                <path
                  key={e.slug}
                  d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
                  fill="none"
                  stroke={on ? "var(--accent)" : "var(--line-strong)"}
                  strokeWidth={on ? 0.55 : 0.3}
                  opacity={focus && !on ? 0.35 : 1}
                  style={{ transition: "stroke 200ms, opacity 200ms, stroke-width 200ms" }}
                />
              );
            })}
          </g>
        </svg>

        {NODES.map((n, i) => {
          const isOn = focus === n.id;
          const depth = 1.6 + (i % 3) * 0.9;
          return (
            <button
              key={n.id}
              type="button"
              onMouseEnter={() => setFocus(n.id)}
              onFocus={() => setFocus(n.id)}
              onClick={() => setFocus((f) => (f === n.id ? null : n.id))}
              aria-pressed={isOn}
              aria-describedby="sg-caption"
              className={cn(
                "absolute flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12.5px] whitespace-nowrap shadow-[var(--shadow-card)] transition-colors duration-150",
                isOn ? "border-accent bg-accent text-accent-fg" : "border-line bg-surface text-fg-2 hover:border-line-strong hover:text-fg",
              )}
              style={{
                left: `${n.x}%`,
                top: `${n.y}%`,
                transform: "translate(-50%, -50%)",
                translate: `calc(var(--px) * ${depth}px) calc(var(--py) * ${depth}px)`,
                transition: "translate 500ms var(--ease-out-quart), background-color 150ms, color 150ms, border-color 150ms",
              }}
            >
              <span className={cn("size-1.5 rounded-full", isOn ? "bg-accent-fg" : "bg-accent")} aria-hidden />
              {n.label}
            </button>
          );
        })}

      </div>
      <div className="mt-6 min-h-[5.5rem] text-center" aria-live="polite" id="sg-caption">
        {focus ? (
          <>
            <p className="font-mono text-[10.5px] tracking-wide text-fg-4 uppercase">{byId[focus].label} meets</p>
            <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
              {active.map((e) => {
                const other = byId[e.a === focus ? e.b : e.a];
                return (
                  <li key={e.slug}>
                    <Link href={`/work/${e.slug}`} className="text-[13.5px] text-fg hover:text-accent">
                      {e.name} <span className="text-fg-4">· {other.label.toLowerCase()}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p className="text-[13px] leading-snug text-fg-3">
            Every line is a project that joins two disciplines.
            <span className="mt-1 block font-mono text-[10.5px] text-fg-4">Hover or focus a discipline</span>
          </p>
        )}
      </div>
    </div>
  );
}
