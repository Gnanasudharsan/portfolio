import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectExplorer, type ExplorerItem } from "@/components/work/project-explorer";
import { RoleSelector } from "@/components/lens/role-lens";
import { MetricKind, StatusBadge } from "@/components/ui/primitives";
import { projects } from "@/data/projects";
import { library } from "@/data/library";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies in agentic AI, GPU inference performance, real-time data platforms, MLOps, and causal inference — plus a searchable library of research and course projects.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const items: ExplorerItem[] = [
    ...projects.map((p) => ({
      slug: p.slug,
      name: p.name,
      summary: p.tagline,
      categories: p.categories,
      year: p.year,
      stack: p.stack,
      metric: p.headline,
      href: `/work/${p.slug}`,
      github: p.links.github,
      live: p.links.live,
      status: p.status,
      caseStudy: true,
    })),
    ...library.map((l) => ({
      slug: l.slug,
      name: l.name,
      summary: l.summary,
      categories: l.categories,
      year: l.year,
      stack: l.stack,
      metric: l.metric,
      github: l.github,
      live: l.live,
      note: l.note,
      caseStudy: false,
    })),
  ];

  return (
    <div className="pt-32 pb-24 sm:pt-40">
      <div className="container-page">
        <p className="eyebrow mb-5">Work</p>
        <h1 className="display max-w-[15ch] !text-[clamp(2.75rem,6.4vw,5.5rem)]">Selected engineering.</h1>
        <p className="lede mt-6 max-w-2xl">
          Ten case studies with architecture, decisions and measured results — then everything else, searchable. Status labels mean what they say: “Live” is
          reachable today, “Research” is a study, “In Development” is unfinished.
        </p>

        <section aria-labelledby="case-studies" className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <h2 id="case-studies" className="text-[1.5rem] font-semibold tracking-[-0.025em]">
              Case studies
            </h2>
            <span className="font-mono text-[12px] text-fg-4">{projects.length} projects</span>
          </div>
          <ol className="mt-6 border-t border-line">
            {projects.map((p, i) => (
              <li key={p.slug} className="group relative border-b border-line">
                <Link
                  href={`/work/${p.slug}`}
                  className="grid grid-cols-1 gap-3 py-6 transition-colors sm:grid-cols-[3rem_minmax(0,1.3fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:py-7"
                >
                  <span className="hidden font-mono text-[12px] text-fg-4 sm:block">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-[1.25rem] font-semibold tracking-[-0.02em] group-hover:text-accent sm:text-[1.375rem]">{p.short}</span>
                      <StatusBadge status={p.status} />
                    </span>
                    <span className="mt-1.5 block text-[14.5px] leading-relaxed text-fg-3">{p.tagline}</span>
                  </span>
                  <span className="min-w-0">
                    <MetricKind kind={p.headline.kind} />
                    <span className="mt-0.5 block text-[1.125rem] font-semibold tabular-nums">{p.headline.value}</span>
                    <span className="block text-[13px] text-fg-3">{p.headline.label}</span>
                  </span>
                  <ArrowRight
                    size={18}
                    className="hidden text-fg-4 transition-transform group-hover:translate-x-1 group-hover:text-fg sm:block"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="library" className="mt-28">
          <h2 id="library" className="text-[1.5rem] font-semibold tracking-[-0.025em]">
            Project library
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] text-fg-3">
            Case studies plus earlier research systems, coursework and labs. Only results backed by a file or report are shown.
          </p>
          <RoleSelector className="mt-8 mb-6" />
          <ProjectExplorer items={items} />
        </section>
      </div>
    </div>
  );
}
