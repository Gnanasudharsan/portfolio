import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project, Visual } from "@/data/types";
import { GitHubIcon } from "@/components/ui/icons";
import { MetricKind, StatusBadge } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { ArchitectureDiagram } from "./architecture-diagram";
import { BarChart, ForestPlot } from "./charts";

export function BrowserFrame({ visual, priority, sizes, className }: { visual: Visual; priority?: boolean; sizes: string; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-[10px] border border-line bg-surface-2", className)}>
      <div className="flex h-7 items-center gap-1.5 border-b border-line px-3" aria-hidden>
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-line-strong" />
        {visual.frame && <span className="ml-2 truncate font-mono text-[10.5px] text-fg-4">{visual.frame}</span>}
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.02] motion-reduce:transition-none"
        />
      </div>
    </div>
  );
}

/** Picks the most honest visual a card can show: a real screenshot, a measured chart, or the documented architecture. */
function CardVisual({ project, priority }: { project: Project; priority?: boolean }) {
  if (project.findings?.length) {
    return (
      <div className="rounded-[10px] border border-line bg-surface p-4">
        <ForestPlot findings={project.findings} compact />
      </div>
    );
  }
  const chart = project.charts?.find((c) => c.bars.length >= 3) ?? project.charts?.[0];
  if (project.layout === "wide" && chart) {
    return (
      <div className="rounded-[10px] border border-line bg-surface p-4">
        <p className="mb-3 font-mono text-[11px] text-fg-4">{chart.subtitle ?? chart.title}</p>
        <BarChart chart={chart} compact />
      </div>
    );
  }
  if (project.visual) {
    return <BrowserFrame visual={project.visual} priority={priority} sizes="(min-width: 1024px) 50vw, 100vw" />;
  }
  if (chart) {
    return (
      <div className="rounded-[10px] border border-line bg-surface p-4">
        <p className="mb-3 font-mono text-[11px] text-fg-4">{chart.subtitle ?? chart.title}</p>
        <BarChart chart={chart} compact />
      </div>
    );
  }
  if (project.architecture) {
    return (
      <div className="rounded-[10px] border border-line bg-surface p-4">
        <ArchitectureDiagram arch={project.architecture} compact />
      </div>
    );
  }
  return null;
}

export function ProjectCard({ project, priority, eager }: { project: Project; priority?: boolean; eager?: boolean }) {
  const href = `/work/${project.slug}`;
  return (
    <article
      className="group @container card relative flex h-full flex-col overflow-hidden transition-[transform,border-color,box-shadow] duration-200 ease-[var(--ease-out-quart)] hover:-translate-y-0.5 hover:border-line-strong motion-reduce:hover:translate-y-0"
      aria-labelledby={`card-${project.slug}`}
    >
      <div className="flex h-full flex-col gap-6 p-5 sm:p-6 @4xl:flex-row @4xl:gap-10 @4xl:p-8">
        <div className="flex min-w-0 flex-col @4xl:w-[42%] @4xl:shrink-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} />
            <span className="font-mono text-[11px] text-fg-4">
              {project.categories[0]} · {project.year}
            </span>
          </div>
          <h3 id={`card-${project.slug}`} className="h-card">
            <Link href={href} className="after:absolute after:inset-0 after:z-0 focus-visible:outline-none" prefetch={eager ? true : undefined}>
              {project.short}
            </Link>
          </h3>
          <p className="mt-3 text-[15.5px] leading-relaxed text-fg-2">{project.tagline}</p>

          <div className="mt-6 border-t border-line pt-5">
            <MetricKind kind={project.headline.kind} />
            <p className="mt-1.5 text-[1.75rem] leading-none font-semibold tracking-[-0.03em] tabular-nums text-fg">{project.headline.value}</p>
            <p className="mt-2 text-[14px] text-fg-2">{project.headline.label}</p>
            {project.headline.context && <p className="mt-1 text-[12.5px] leading-snug text-fg-4">{project.headline.context}</p>}
          </div>

          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Key technologies">
            {project.stack.slice(0, 6).map((t) => (
              <li key={t} className="rounded-md border border-line px-2 py-0.5 text-[12px] text-fg-3">
                {t}
              </li>
            ))}
          </ul>

          <div className="relative z-10 mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-[13.5px]">
            <span className="inline-flex items-center gap-1 font-medium text-fg">
              Case study <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </span>
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-8 items-center gap-1.5 text-fg-3 hover:text-fg"
              aria-label={`${project.short} on GitHub (opens in new tab)`}
            >
              <GitHubIcon size={14} /> Code
            </a>
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-8 items-center gap-1.5 text-fg-3 hover:text-fg"
                aria-label={`${project.short} live site (opens in new tab)`}
              >
                <span className="size-1.5 rounded-full bg-teal" aria-hidden /> {project.status === "Live" ? "Live" : "Site"}
              </a>
            )}
          </div>
        </div>
        <div className="relative z-0 min-w-0 flex-1 @4xl:self-center">
          <CardVisual project={project} priority={priority} />
        </div>
      </div>
    </article>
  );
}
