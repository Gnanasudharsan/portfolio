import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import type { Metric, ProjectStatus } from "@/data/types";
import { cn } from "@/lib/cn";

const statusStyle: Record<ProjectStatus, string> = {
  Live: "text-teal bg-teal-soft",
  Production: "text-teal bg-teal-soft",
  Research: "text-accent bg-accent-soft",
  "Case Study": "text-fg-2 bg-surface-2",
  "In Development": "text-amber bg-amber-soft",
  Archived: "text-fg-3 bg-surface-2",
};

export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 font-mono text-[11px] tracking-wide",
        statusStyle[status],
        className,
      )}
    >
      {(status === "Live" || status === "Production") && (
        <span className="relative flex size-1.5" aria-hidden>
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-40 motion-reduce:hidden" />
          <span className="relative inline-flex size-1.5 rounded-full bg-current" />
        </span>
      )}
      {status}
    </span>
  );
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-md border border-line bg-surface px-2.5 text-[12.5px] text-fg-2",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TagList({ items, max, className }: { items: string[]; max?: number; className?: string }) {
  const shown = max ? items.slice(0, max) : items;
  const rest = max ? items.length - shown.length : 0;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Technologies">
      {shown.map((t) => (
        <li key={t}>
          <Tag>{t}</Tag>
        </li>
      ))}
      {rest > 0 && (
        <li>
          <Tag className="text-fg-4">+{rest}</Tag>
        </li>
      )}
    </ul>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  className?: string;
  size?: "md" | "sm";
  download?: boolean | string;
};

export function ButtonLink({ href, children, variant = "secondary", external, className, size = "md", download }: ButtonProps) {
  const cls = cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,opacity,border-color,transform] duration-150 active:scale-[0.98]",
    size === "md" ? "h-11 px-5 text-[15px]" : "h-10 px-4 text-[14px]",
    variant === "primary" && "bg-fg text-bg hover:opacity-85",
    variant === "secondary" && "border border-line-strong bg-surface text-fg hover:border-fg-4",
    variant === "ghost" && "text-fg-2 hover:text-fg",
    className,
  );
  const icon = external ? (
    <ArrowUpRight size={15} className="transition-transform duration-150 group-hover:-translate-y-px group-hover:translate-x-px" aria-hidden />
  ) : (
    <ArrowRight size={15} className="transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
  );
  if (external || download || /^(mailto:|https?:)/.test(href)) {
    return (
      <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} download={download}>
        {children}
        {external && <span className="sr-only">(opens in new tab)</span>}
        {!download && icon}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
      {icon}
    </Link>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lede,
  id,
  action,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-3xl">
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h2 id={id} className="h-section">
          {title}
        </h2>
        {lede && <p className="lede mt-5 max-w-2xl">{lede}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function MetricKind({ kind }: { kind: Metric["kind"] }) {
  const label = kind === "measured" ? "Measured" : kind === "target" ? "Target" : "Reported";
  return (
    <span
      className={cn(
        "font-mono text-[10.5px] tracking-wide uppercase",
        kind === "measured" ? "text-teal" : kind === "target" ? "text-amber" : "text-fg-4",
      )}
    >
      {label}
    </span>
  );
}

export function MetricBlock({ metric, large }: { metric: Metric; large?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <MetricKind kind={metric.kind} />
      <div className={cn("font-semibold tracking-[-0.03em] text-fg tabular-nums", large ? "text-[2.5rem] leading-none" : "text-[1.75rem] leading-none")}>
        {metric.value}
      </div>
      <div className="text-[14px] leading-snug text-fg-2">{metric.label}</div>
      {metric.context && <div className="text-[12.5px] leading-snug text-fg-4">{metric.context}</div>}
    </div>
  );
}
