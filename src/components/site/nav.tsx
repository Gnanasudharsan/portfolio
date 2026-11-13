"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Command, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GitHubIcon, LinkedInIcon, Monogram } from "@/components/ui/icons";
import { ThemeToggle } from "./theme-toggle";
import { profile } from "@/data/profile";
import { cn } from "@/lib/cn";

const links = [
  { href: "/work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function openPalette() {
  window.dispatchEvent(new Event("ga-open-palette"));
}

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <header className="no-print fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-2 rounded-2xl border px-2 pl-3 transition-[background-color,border-color,box-shadow] duration-200 sm:px-3",
          scrolled
            ? "border-line bg-[var(--nav-bg)] shadow-[var(--shadow-card)] backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent",
        )}
      >
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2.5 rounded-lg pr-2 text-fg"
          aria-label={`${profile.name} — home`}
        >
          <Monogram size={28} className="text-fg" />
          <span className="hidden text-[15px] font-semibold tracking-[-0.01em] sm:inline">
            Gnanasudharsan<span className="text-accent">.</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <li key={l.href} className="relative">
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative z-10 inline-flex h-9 items-center rounded-full px-3.5 text-[14px] transition-colors duration-150",
                    active ? "bg-surface-2 text-fg ring-1 ring-line" : "text-fg-3 hover:text-fg",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={openPalette}
            className="hidden h-9 items-center gap-1.5 rounded-full border border-line px-2.5 font-mono text-[12px] text-fg-3 transition-colors hover:text-fg lg:inline-flex"
            aria-label="Open command palette"
          >
            <Command size={13} aria-hidden /> K
          </button>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile (opens in new tab)"
            className="hidden size-10 items-center justify-center rounded-full text-fg-3 transition-colors hover:bg-surface-2 hover:text-fg sm:inline-flex"
          >
            <GitHubIcon size={17} />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile (opens in new tab)"
            className="hidden size-10 items-center justify-center rounded-full text-fg-3 transition-colors hover:bg-surface-2 hover:text-fg sm:inline-flex"
          >
            <LinkedInIcon size={16} />
          </a>
          <ThemeToggle />
          <Link
            href="/resume"
            className={cn(
              "ml-1 hidden h-9 items-center rounded-full px-3.5 text-[14px] transition-colors md:inline-flex",
              isActive(pathname, "/resume") ? "bg-surface-2 text-fg ring-1 ring-line" : "text-fg-2 hover:text-fg",
            )}
            aria-current={isActive(pathname, "/resume") ? "page" : undefined}
          >
            Résumé
          </Link>
          <Link
            href="/#contact"
            className="ml-1 hidden h-9 items-center rounded-full bg-fg px-4 text-[14px] font-medium text-bg transition-opacity hover:opacity-85 md:inline-flex"
          >
            Contact
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-fg md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      <dialog
        id="mobile-menu"
        ref={dialogRef}
        aria-label="Site menu"
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialogRef.current && setOpen(false)}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-3 backdrop:bg-black/40 backdrop:backdrop-blur-sm"
      >
        <div className="card flex flex-col gap-1 p-3">
          <div className="mb-2 flex items-center justify-between pl-2">
            <span className="flex items-center gap-2.5 font-semibold">
              <Monogram size={26} className="text-fg" /> Gnanasudharsan
            </span>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full text-fg"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              autoFocus
            >
              <X size={20} />
            </button>
          </div>
          {[...links, { href: "/resume", label: "Résumé" }, { href: "/#contact", label: "Contact" }].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(pathname, l.href) ? "page" : undefined}
              className="flex min-h-12 items-center rounded-xl px-3 text-[17px] text-fg hover:bg-surface-2 aria-[current=page]:bg-surface-2"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2 border-t border-line px-1 pt-3">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-line text-[15px] text-fg-2"
            >
              <GitHubIcon size={16} /> GitHub
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-line text-[15px] text-fg-2"
            >
              <LinkedInIcon size={15} /> LinkedIn
            </a>
          </div>
        </div>
      </dialog>
    </header>
  );
}
