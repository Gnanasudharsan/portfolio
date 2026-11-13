"use client";

import { useSyncExternalStore } from "react";
import type { RoleId } from "@/data/types";
import { roles } from "@/data/roles";

import { ROLE_KEY as KEY } from "@/lib/scripts";
const EVENT = "ga-role-lens-change";
const valid = new Set<string>(roles.map((r) => r.id));

function read(): RoleId | null {
  try {
    const v = localStorage.getItem(KEY);
    return v && valid.has(v) ? (v as RoleId) : null;
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function setRole(role: RoleId | null) {
  try {
    if (role) localStorage.setItem(KEY, role);
    else localStorage.removeItem(KEY);
  } catch {
    /* ignore — selection simply won't persist */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Role lens selection; `null` on the server and when unset. */
export function useRole(): RoleId | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
