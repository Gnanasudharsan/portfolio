"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight, CornerDownLeft, Search } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export interface PaletteItem {
  id: string;
  group: "Pages" | "Projects" | "Research" | "Experience" | "Actions";
  label: string;
  hint?: string;
  href?: string;
  external?: boolean;
  copy?: string;
}

export function CommandPalette({ items }: { items: PaletteItem[] }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const listId = useId();

  const open = useCallback(() => {
    const d = dialogRef.current;
    if (d && !d.open) {
      setQuery("");
      setActive(0);
      d.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("ga-open-palette", open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("ga-open-palette", open);
    };
  }, [open, close]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    const terms = q.split(/\s+/);
    return items.filter((i) => {
      const hay = `${i.label} ${i.hint ?? ""} ${i.group}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [items, query]);

  const run = async (item: PaletteItem) => {
    if (item.copy) {
      try {
        await navigator.clipboard.writeText(item.copy);
        setToast("Email copied");
      } catch {
        setToast(item.copy);
      }
      window.setTimeout(() => setToast(null), 1600);
      return;
    }
    close();
    if (!item.href) return;
    if (item.external) window.open(item.href, "_blank", "noopener,noreferrer");
    else router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      run(results[active]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command palette"
      onClick={(e) => e.target === dialogRef.current && close()}
      className="no-print mx-auto mt-[12vh] w-[min(640px,calc(100%-24px))] max-w-none bg-transparent p-0 backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      <div className="card overflow-hidden shadow-[var(--shadow-pop)]">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={17} className="shrink-0 text-fg-4" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${results[active].id}` : undefined}
            aria-label="Search projects, research, pages and actions"
            placeholder="Search projects, research, actions…"
            className="h-14 w-full bg-transparent text-[16px] text-fg outline-none placeholder:text-fg-4"
          />
          <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-fg-4 sm:block">esc</kbd>
        </div>
        <ul id={listId} role="listbox" aria-label="Results" className="max-h-[min(420px,60vh)] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-8 text-center text-[14px] text-fg-3">No matches for “{query}”.</li>}
          {results.map((item, idx) => {
            const header = idx === 0 || results[idx - 1].group !== item.group ? item.group : null;
            return (
              <li key={item.id} role="presentation">
                {header && <div className="eyebrow px-3 pt-3 pb-1.5 !text-[10.5px]">{header}</div>}
                <div
                  id={`${listId}-${item.id}`}
                  role="option"
                  aria-selected={idx === active}
                  onMouseMove={() => setActive(idx)}
                  onClick={() => run(item)}
                  className={cn(
                    "flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-[14.5px]",
                    idx === active ? "bg-surface-2 text-fg" : "text-fg-2",
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate">{item.label}</span>
                    {item.hint && <span className="block truncate text-[12.5px] text-fg-4">{item.hint}</span>}
                  </span>
                  {idx === active &&
                    (item.external ? (
                      <ArrowUpRight size={15} className="shrink-0 text-fg-4" aria-hidden />
                    ) : (
                      <CornerDownLeft size={14} className="shrink-0 text-fg-4" aria-hidden />
                    ))}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[12px] text-fg-4">
          <span>↑↓ to navigate · ↵ to open</span>
          <span aria-live="polite">{toast}</span>
        </div>
      </div>
    </dialog>
  );
}
