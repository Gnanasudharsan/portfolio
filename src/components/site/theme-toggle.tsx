"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

import { THEME_KEY as KEY } from "@/lib/scripts";

function read(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
}

export function setTheme(next: Theme) {
  const root = document.documentElement;
  root.classList.add("theme-transition");
  root.dataset.theme = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* storage unavailable — theme still applies for this page view */
  }
  window.setTimeout(() => root.classList.remove("theme-transition"), 260);
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore<Theme | null>(subscribe, read, () => null);
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={theme ? `Switch to ${next} theme` : "Toggle theme"}
      title={theme ? `Switch to ${next} theme` : "Toggle theme"}
      className={`inline-flex size-10 items-center justify-center rounded-full text-fg-3 transition-colors duration-150 hover:bg-surface-2 hover:text-fg ${className}`}
    >
      <Sun size={17} strokeWidth={1.75} className="hidden dark:block" />
      <Moon size={17} strokeWidth={1.75} className="block dark:hidden" />
    </button>
  );
}
