import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ScholarIcon, GitHubIcon } from "@/components/ui/icons";
import { ButtonLink } from "@/components/ui/primitives";
import { publications, doiUrl, SCHOLAR_URL } from "@/data/research";
import { library } from "@/data/library";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Ten co-authored IEEE conference publications (2022–2024) across machine learning, computer vision, healthcare analytics, IoT, blockchain, cloud security and autonomous systems — each with its DOI.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a);
  const domains = Object.entries(
    publications.reduce<Record<string, number>>((acc, p) => {
      acc[p.domain] = (acc[p.domain] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="pt-32 pb-24 sm:pt-40">
      <div className="container-page">
        <p className="eyebrow mb-5">Research</p>
        <h1 className="display max-w-[16ch] !text-[clamp(2.5rem,6vw,5.25rem)]">Engineering backed by research.</h1>
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <p className="lede max-w-2xl">
            Ten co-authored papers in IEEE Xplore from undergraduate research — most of them built as working hardware or software systems, not
            just analyses. Several have code on GitHub. The more recent causal-inference study, Cordon, lives in{" "}
            <Link href="/work/cordon" className="link-underline text-fg">
              Work
            </Link>
            .
          </p>
          <div className="flex flex-wrap items-start gap-3 lg:justify-end">
            <ButtonLink href={SCHOLAR_URL} variant="secondary" external>
              <ScholarIcon size={15} /> Google Scholar
            </ButtonLink>
          </div>
        </div>

        <ul className="mt-12 flex flex-wrap gap-2" aria-label="Domains">
          {domains.map(([d, n]) => (
            <li key={d} className="inline-flex h-8 items-center gap-2 rounded-full border border-line bg-surface px-3 text-[13px] text-fg-2">
              {d} <span className="font-mono text-[11px] text-fg-4">{n}</span>
            </li>
          ))}
        </ul>

        {years.map((y) => (
          <section key={y} aria-labelledby={`y-${y}`} className="mt-16">
            <h2 id={`y-${y}`} className="flex items-baseline gap-3 border-b border-line pb-3">
              <span className="text-[1.75rem] font-semibold tracking-[-0.03em] tabular-nums">{y}</span>
              <span className="font-mono text-[12px] text-fg-4">{publications.filter((p) => p.year === y).length} papers</span>
            </h2>
            <ol>
              {publications
                .filter((p) => p.year === y)
                .map((p) => {
                  const code = library.find((l) => l.paperId === p.id);
                  return (
                    <li key={p.id} id={p.id} className="scroll-mt-28 border-b border-line py-8">
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-12">
                        <div>
                          <p className="font-mono text-[11.5px] text-fg-4">
                            {p.domain} · {p.date}
                          </p>
                          <h3 className="mt-2 text-[1.25rem] leading-snug font-semibold tracking-[-0.02em]">{p.title}</h3>
                          <p className="mt-3 max-w-3xl text-[15.5px] leading-relaxed text-fg-2">{p.contribution}</p>
                          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Methods">
                            {p.methods.map((m) => (
                              <li key={m} className="rounded-md bg-surface-2 px-2 py-0.5 text-[12px] text-fg-3">
                                {m}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-col gap-3 text-[13.5px]">
                          <p className="leading-snug text-fg-3">{p.venue}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            <a href={doiUrl(p.doi)} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-1 font-mono text-[12px] text-fg-2 hover:text-accent">
                              DOI <ArrowUpRight size={12} aria-hidden />
                              <span className="sr-only">for {p.title} (opens in new tab)</span>
                            </a>
                            {(p.github ?? code?.github) && (
                              <a
                                href={p.github ?? code?.github}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex min-h-9 items-center gap-1.5 text-[12.5px] text-fg-3 hover:text-fg"
                              >
                                <GitHubIcon size={13} /> Code
                                <span className="sr-only">for {p.title} (opens in new tab)</span>
                              </a>
                            )}
                          </div>
                          <p className="font-mono text-[11px] break-all text-fg-4">{p.doi}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
