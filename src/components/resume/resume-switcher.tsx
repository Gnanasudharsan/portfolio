"use client";

import { Download, Printer } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useRole } from "@/components/lens/role-store";
import { cn } from "@/lib/cn";

export function ResumeSwitcher({
  variants,
}: {
  variants: { id: string; label: string; file: string; node: ReactNode }[];
}) {
  const role = useRole();
  const [chosen, setActive] = useState<string | null>(null);
  // Explicit choice wins; otherwise follow the role lens; otherwise general.
  const active = chosen ?? (role && variants.some((v) => v.id === role) ? role : "general");

  const current = variants.find((v) => v.id === active) ?? variants[0];

  return (
    <div>
      <div className="no-print flex flex-col gap-4">
        <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0">
          <div role="tablist" aria-label="Résumé emphasis" className="flex w-max gap-1 rounded-full border border-line bg-surface p-1">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                id={`tab-${v.id}`}
                aria-selected={v.id === active}
                aria-controls="resume-panel"
                onClick={() => setActive(v.id)}
                className={cn(
                  "h-9 rounded-full px-3.5 text-[13.5px] whitespace-nowrap transition-colors",
                  v.id === active ? "bg-fg text-bg" : "text-fg-3 hover:text-fg",
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={`/resume/${current.file}`}
            download
            className="inline-flex h-11 items-center gap-2 rounded-full bg-fg px-5 whitespace-nowrap text-[14.5px] font-medium text-bg hover:opacity-85"
            data-testid="resume-download"
          >
            <Download size={15} aria-hidden /> Download PDF
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-[14px] text-fg-2 hover:text-fg"
          >
            <Printer size={15} aria-hidden /> Print
          </button>
        </div>
      </div>
      <div
        id="resume-panel"
        role="tabpanel"
        aria-labelledby={`tab-${current.id}`}
        className="card mt-8 p-6 sm:p-10 print:mt-0 print:border-0 print:p-0 print:shadow-none"
      >
        {current.node}
      </div>
    </div>
  );
}
