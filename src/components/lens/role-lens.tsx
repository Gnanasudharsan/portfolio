"use client";

import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, type ReactNode } from "react";
import { roles, roleById } from "@/data/roles";
import type { RoleId } from "@/data/types";
import { cn } from "@/lib/cn";
import { setRole, useRole } from "./role-store";

/** Mirrors the lens onto <html data-role> so server-rendered sections can respond with CSS only. */
export function RoleAttributeSync() {
  const role = useRole();
  useEffect(() => {
    const root = document.documentElement;
    if (role) root.dataset.role = role;
    else delete root.dataset.role;
  }, [role]);
  return null;
}

export function RoleSelector({ className }: { className?: string }) {
  const role = useRole();
  const reduce = useReducedMotion();
  const active = roleById(role);
  const options: { id: RoleId | null; label: string }[] = [{ id: null, label: "Everything" }, ...roles.map((r) => ({ id: r.id, label: r.label }))];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p id="lens-label" className="shrink-0 text-[14px] text-fg-3">
          Explore my work as
        </p>
        <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 [scrollbar-width:none]">
          <LayoutGroup id="lens">
            <div role="radiogroup" aria-labelledby="lens-label" className="flex w-max gap-1 rounded-full border border-line bg-surface p-1">
              {options.map((o) => {
                const selected = role === o.id;
                return (
                  <button
                    key={o.label}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setRole(o.id)}
                    className={cn(
                      "relative h-9 rounded-full px-3.5 text-[13.5px] whitespace-nowrap transition-colors duration-150",
                      selected ? "text-bg" : "text-fg-3 hover:text-fg",
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="lens-pill"
                        className="absolute inset-0 rounded-full bg-fg"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 38 }}
                      />
                    )}
                    <span className="relative">{o.label}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>
      </div>
      <p className="min-h-5 font-mono text-[12px] text-fg-4" aria-live="polite">
        {active ? `Ordered for ${active.label.toLowerCase()} roles · ${active.focus}` : "Role-agnostic order · your choice is remembered on this device"}
      </p>
    </div>
  );
}

const SPANS = [
  "lg:col-span-12",
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-12",
  "lg:col-span-6",
  "lg:col-span-6",
  "lg:col-span-5",
  "lg:col-span-7",
];

/** Reorders server-rendered cards by the active role; the editorial grid rhythm stays fixed by position. */
export function RoleOrderedGrid({ items, defaultOrder }: { items: { slug: string; node: ReactNode }[]; defaultOrder: string[] }) {
  const role = useRole();
  const reduce = useReducedMotion();
  const order = useMemo(() => {
    const r = roleById(role);
    const wanted = r ? r.order : defaultOrder;
    const map = new Map(items.map((i) => [i.slug, i]));
    return wanted.map((s) => map.get(s)).filter(Boolean).slice(0, 8) as { slug: string; node: ReactNode }[];
  }, [role, items, defaultOrder]);

  return (
    <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
      {order.map((item, i) => (
        <motion.li
          key={item.slug}
          layout={reduce ? false : "position"}
          transition={{ type: "spring", stiffness: 260, damping: 34, mass: 0.9 }}
          className={cn(SPANS[i] ?? "lg:col-span-6", i === 0 || i === 3 ? "md:col-span-2" : "md:col-span-1")}
        >
          {item.node}
        </motion.li>
      ))}
    </ol>
  );
}

/** Applies the role's default category to a controlled filter, once per role change. */
export function useRoleDefaultFilter(onChange: (filter: string) => void) {
  const role = useRole();
  useEffect(() => {
    const r = roleById(role);
    onChange(r ? r.filter : "All");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);
}
