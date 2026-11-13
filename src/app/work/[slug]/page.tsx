import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projectBySlug, projects } from "@/data/projects";
import { publications, doiUrl } from "@/data/research";
import { ArchitectureDiagram } from "@/components/work/architecture-diagram";
import { BarChart, ForestPlot } from "@/components/work/charts";
import { BrowserFrame } from "@/components/work/project-card";
import { ShareButton } from "@/components/work/share-button";
import { GitHubIcon } from "@/components/ui/icons";
import { ButtonLink, MetricKind, StatusBadge, TagList } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/motion";
import { jsonLd, projectJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}


export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  return {
    title: p.short,
    description: p.tagline,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: `${p.name}`, description: p.tagline, type: "article", url: `/work/${p.slug}` },
    twitter: { card: "summary_large_image", title: p.name, description: p.tagline },
  };
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28 border-t border-line pt-10 pb-14">
      <h2 id={`${id}-h`} className="mb-6 text-[1.375rem] font-semibold tracking-[-0.025em] sm:text-[1.625rem]">
        {title}
      </h2>
      {children}
    </section>
  );
}

async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();

  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length];
  const papers = publications.filter((pub) => pub.github && pub.github === p.links.github);

  const toc = [
    { id: "problem", label: "The problem" },
    { id: "built", label: "What I built" },
    p.architecture && { id: "architecture", label: "Architecture" },
    { id: "contribution", label: "My contribution" },
    { id: "decisions", label: "Engineering decisions" },
    { id: "results", label: "Results" },
    p.reliability.length > 0 && { id: "reliability", label: "Reliability & evaluation" },
    { id: "lessons", label: "What I learned" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <article className="pt-28 pb-24 sm:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(projectJsonLd(p)) }} />
      <div className="container-page">
        <Link href="/work" className="inline-flex min-h-10 items-center gap-1.5 text-[14px] text-fg-3 hover:text-fg">
          <ArrowLeft size={15} aria-hidden /> All work
        </Link>

        <header className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <StatusBadge status={p.status} />
              <span className="font-mono text-[12px] text-fg-4">
                {p.categories.join(" · ")} · {p.period}
              </span>
            </div>
            <h1 className="mt-6 text-[clamp(2.25rem,5.2vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.04em]">{p.name}</h1>
            <p className="lede mt-6 max-w-2xl">{p.thesis}</p>
          </div>
          <div className="flex flex-col gap-5 lg:items-end">
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={p.links.github} variant="primary" external>
                <GitHubIcon size={16} /> Repository
              </ButtonLink>
              {p.links.live && (
                <ButtonLink href={p.links.live} variant="secondary" external>
                  Live demo
                </ButtonLink>
              )}
              {p.links.paper && (
                <ButtonLink href={p.links.paper} variant="secondary" external>
                  Paper
                </ButtonLink>
              )}
            </div>
            <ShareButton title={p.name} />
          </div>
        </header>

        <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-3 lg:grid-cols-6">
          {p.metrics.slice(0, 6).map((m) => (
            <div key={m.label} className="flex flex-col gap-1.5 bg-surface p-4 sm:p-5">
              <dt className="order-2 text-[13px] leading-snug text-fg-2">{m.label}</dt>
              <dd className="order-1">
                <MetricKind kind={m.kind} />
                <span className="mt-1 block text-[1.5rem] leading-none font-semibold tracking-[-0.03em] tabular-nums">{m.value}</span>
              </dd>
              {m.context && <dd className="order-3 text-[11.5px] leading-snug text-fg-4">{m.context}</dd>}
            </div>
          ))}
        </dl>

        {p.visual && (
          <Reveal className="mt-10">
            <figure>
              <BrowserFrame visual={p.visual} priority sizes="(min-width: 1280px) 1200px, 100vw" className="shadow-[var(--shadow-pop)]" />
              {p.visual.caption && <figcaption className="mt-3 text-[13px] text-fg-4">{p.visual.caption}</figcaption>}
            </figure>
          </Reveal>
        )}

        <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-28">
              <p className="eyebrow mb-4">On this page</p>
              <ul className="flex flex-col gap-1 border-l border-line">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-[13.5px] text-fg-3 hover:border-fg hover:text-fg">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <p className="eyebrow mb-3">Stack</p>
                <TagList items={p.stack} />
              </div>
            </nav>
          </aside>

          <div className="min-w-0">
            <Section id="problem" title="The problem">
              <div className="prose-case max-w-3xl">
                <p>{p.problem}</p>
              </div>
            </Section>

            <Section id="built" title="What I built">
              <div className="prose-case max-w-3xl">
                <p>{p.built}</p>
              </div>
              <div className="mt-6 lg:hidden">
                <TagList items={p.stack} />
              </div>
            </Section>

            {p.architecture && (
              <Section id="architecture" title="Architecture">
                <ArchitectureDiagram arch={p.architecture} />
              </Section>
            )}

            <Section id="contribution" title="My contribution">
              <p className="max-w-3xl rounded-xl border border-line bg-surface-2 p-5 text-[15.5px] leading-relaxed text-fg-2">{p.contribution}</p>
            </Section>

            <Section id="decisions" title="Engineering decisions">
              <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {p.decisions.map((d, i) => (
                  <li key={d.title} className="card p-5">
                    <p className="font-mono text-[11px] text-fg-4">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-2 text-[16px] font-semibold">{d.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-fg-2">{d.body}</p>
                  </li>
                ))}
              </ol>
              {p.sections.map((s) => (
                <div key={s.heading} className="mt-10 max-w-3xl">
                  <h3 className="mb-3 text-[1.125rem] font-semibold">{s.heading}</h3>
                  <div className="prose-case">
                    {s.body.map((b) => (
                      <p key={b.slice(0, 32)}>{b}</p>
                    ))}
                  </div>
                </div>
              ))}
            </Section>

            <Section id="results" title="Results">
              <div className="flex flex-col gap-4">
                {p.findings && <ForestPlot findings={p.findings} />}
                {p.charts && p.charts.length > 0 && (
                  <div className={p.charts.length > 1 ? "grid gap-4 xl:grid-cols-2" : ""}>
                    {p.charts.map((c) => (
                      <BarChart key={c.title} chart={c} />
                    ))}
                  </div>
                )}
                <ul className="mt-2 flex flex-col">
                  {p.metrics.map((m) => (
                    <li key={m.label} className="grid grid-cols-1 gap-1 border-t border-line py-4 sm:grid-cols-[9rem_1fr_auto] sm:items-baseline sm:gap-6">
                      <span className="text-[1.125rem] font-semibold tabular-nums">{m.value}</span>
                      <span className="text-[14.5px] text-fg-2">
                        {m.label}
                        {m.context && <span className="block text-[13px] text-fg-4">{m.context}</span>}
                      </span>
                      <span className="flex items-center gap-3">
                        <MetricKind kind={m.kind} />
                        {m.source && (
                          <a
                            href={m.source}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-8 items-center gap-1 font-mono text-[11px] text-fg-4 hover:text-accent"
                          >
                            source <ArrowUpRight size={11} aria-hidden />
                            <span className="sr-only">for {m.label} (opens in new tab)</span>
                          </a>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                {p.gallery && p.gallery.length > 0 && (
                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {p.gallery.map((g) => (
                      <figure key={g.src} className="card overflow-hidden">
                        <div className="relative aspect-[16/10] border-b border-line bg-surface-2">
                          <Image src={g.src} alt={g.alt} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover object-top" />
                        </div>
                        {g.caption && <figcaption className="p-4 text-[13px] text-fg-3">{g.caption}</figcaption>}
                      </figure>
                    ))}
                  </div>
                )}
              </div>
            </Section>

            {p.reliability.length > 0 && (
              <Section id="reliability" title="Reliability & evaluation">
                <ul className="flex max-w-3xl flex-col gap-3">
                  {p.reliability.map((r) => (
                    <li key={r.slice(0, 40)} className="flex gap-3 text-[15px] leading-relaxed text-fg-2">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal" aria-hidden />
                      {r}
                    </li>
                  ))}
                </ul>
                {p.caveats.length > 0 && (
                  <div className="mt-8 max-w-3xl rounded-xl border border-amber/30 bg-amber-soft p-5">
                    <p className="font-mono text-[11px] tracking-wide text-amber uppercase">Limitations, stated plainly</p>
                    <ul className="mt-3 flex flex-col gap-2">
                      {p.caveats.map((c) => (
                        <li key={c.slice(0, 40)} className="text-[14.5px] leading-relaxed text-fg-2">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Section>
            )}

            <Section id="lessons" title="What I learned">
              <ul className="flex max-w-3xl flex-col gap-4">
                {p.lessons.map((l) => (
                  <li key={l.slice(0, 40)} className="border-l-2 border-accent pl-5 text-[16px] leading-relaxed text-fg-2">
                    {l}
                  </li>
                ))}
              </ul>
            </Section>

            <section aria-labelledby="links-h" className="border-t border-line pt-10">
              <h2 id="links-h" className="mb-5 text-[1.125rem] font-semibold">
                Links
              </h2>
              <ul className="flex flex-wrap gap-2">
                <li>
                  <a href={p.links.github} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-[14px] text-fg-2 hover:text-fg">
                    <GitHubIcon size={14} /> GitHub
                  </a>
                </li>
                {p.links.live && (
                  <li>
                    <a href={p.links.live} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-4 text-[14px] text-fg-2 hover:text-fg">
                      Live demo <ArrowUpRight size={13} aria-hidden />
                    </a>
                  </li>
                )}
                {p.links.docs?.map((d) => (
                  <li key={d.href}>
                    <a href={d.href} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-4 text-[14px] text-fg-2 hover:text-fg">
                      {d.label} <ArrowUpRight size={13} aria-hidden />
                    </a>
                  </li>
                ))}
                {papers.map((pub) => (
                  <li key={pub.id}>
                    <a href={doiUrl(pub.doi)} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-4 text-[14px] text-fg-2 hover:text-fg">
                      IEEE paper <ArrowUpRight size={13} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <Link
          href={`/work/${next.slug}`}
          className="group mt-24 flex items-center justify-between gap-6 rounded-[var(--radius-card)] border border-line bg-surface p-6 transition-colors hover:border-line-strong sm:p-8"
        >
          <span>
            <span className="eyebrow">Next case study</span>
            <span className="mt-2 block text-[1.5rem] font-semibold tracking-[-0.025em] group-hover:text-accent">{next.short}</span>
            <span className="mt-1 block max-w-xl text-[14px] text-fg-3">{next.tagline}</span>
          </span>
          <ArrowRight size={22} className="shrink-0 text-fg-4 transition-transform group-hover:translate-x-1 group-hover:text-fg" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

function CaseStudySkeleton() {
  return (
    <div className="container-page pt-28 pb-24 sm:pt-36" aria-busy="true" aria-label="Loading case study">
      <div className="h-10 w-28 rounded-full bg-surface-2" />
      <div className="mt-8 h-6 w-48 rounded-full bg-surface-2" />
      <div className="mt-6 h-16 max-w-3xl rounded-xl bg-surface-2" />
      <div className="mt-4 h-16 max-w-2xl rounded-xl bg-surface-2" />
      <div className="mt-14 h-28 rounded-[var(--radius-card)] bg-surface-2" />
    </div>
  );
}

/** Unknown slugs never reach here: src/proxy.ts answers them with a real 404. */
export default function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  return (
    <Suspense fallback={<CaseStudySkeleton />}>
      <CaseStudy params={params} />
    </Suspense>
  );
}
