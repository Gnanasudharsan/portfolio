import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { CountUp, Reveal, RollingNumber } from "@/components/ui/motion";
import { ButtonLink, SectionHeader } from "@/components/ui/primitives";
import { CopyEmail } from "@/components/ui/copy-email";
import { GitHubIcon, LinkedInIcon, ScholarIcon } from "@/components/ui/icons";
import { credibility, philosophy, principles, profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { buildSkillCategories } from "@/lib/skills";
import { SkillCategories } from "@/components/home/skill-categories";
import { publications, doiUrl } from "@/data/research";
import { awards } from "@/data/awards";
import { education } from "@/data/education";
import { certifications } from "@/data/certifications";
import { cn } from "@/lib/cn";

export function Credibility() {
  return (
    <section aria-label="Highlights" className="border-y border-line bg-surface">
      <dl className="container-page grid grid-cols-2 md:grid-cols-4">
        {credibility.map((c, i) => (
          <div
            key={c.label}
            className={cn(
              "flex flex-col gap-1.5 py-7 sm:py-9",
              i % 2 === 1 && "border-l border-line pl-5 sm:pl-8",
              i >= 2 && "border-t border-line md:border-t-0",
              i === 2 && "md:border-l md:pl-8",
              i > 0 && "md:pl-8",
            )}
          >
            <dt className="order-2 text-[14px] text-fg-2">{c.label}</dt>
            <dd className="order-1 text-[2.25rem] leading-none font-semibold tracking-[-0.04em] tabular-nums sm:text-[2.75rem]">
              <RollingNumber value={c.value} decimals={"decimals" in c ? c.decimals : 0} delay={i * 0.12} />
              <span className="text-fg-3">{c.suffix}</span>
            </dd>
            <dd className="order-3 font-mono text-[11.5px] text-fg-4">{c.detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Philosophy() {
  return (
    <section aria-labelledby="philosophy-title" className="py-24 sm:py-32">
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="eyebrow mb-4">How I work</p>
          <h2 id="philosophy-title" className="h-section">
            Evidence over hype.
          </h2>
          <p className="lede mt-5 max-w-md">
            Every project here separates what was measured from what was targeted, and links each number to the file it came from.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Principles">
            {principles.map((p) => (
              <li key={p} className="rounded-full border border-line px-3 py-1 text-[13px] text-fg-3">
                {p}
              </li>
            ))}
          </ul>
        </div>
        <ol className="flex flex-col">
          {philosophy.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.06} className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-line py-7 last:border-b">
              <span className="pt-1.5 font-mono text-[12px] text-fg-4">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-[1.5rem] font-semibold tracking-[-0.025em] sm:text-[1.75rem]">{p.title}</h3>
                <p className="mt-2 max-w-xl text-[16px] leading-relaxed text-fg-2">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Experience() {
  const primary = experience.filter((e) => e.kind === "primary");
  const earlier = experience.filter((e) => e.kind === "earlier");
  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-24 border-t border-line bg-bg-subtle py-24 sm:py-32">
      <div className="container-page">
        <SectionHeader
          id="experience-title"
          eyebrow="Experience"
          title="Shipping systems, not demos."
          lede="Two startups, two very different stacks — production LLM systems in Boston, and computer vision on embedded hardware in Chennai."
        />
        <ol className="mt-16 flex flex-col gap-6">
          {primary.map((e) => (
            <Reveal as="li" key={e.id} className="card grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-[17rem_1fr] lg:gap-12">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="font-mono text-[12px] text-fg-4">
                  {e.start} — {e.end}
                </p>
                <h3 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.025em]">{e.org}</h3>
                <p className="mt-1 text-[15px] text-fg-2">{e.role}</p>
                <p className="text-[14px] text-fg-4">{e.location}</p>
                <p className="mt-5 text-[15px] leading-relaxed text-fg-2">{e.summary}</p>
              </div>
              <div>
                {e.systems && (
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {e.systems.map((s) => (
                      <li key={s.title} className="lens-hl relative rounded-xl border border-line bg-surface p-5" data-roles={s.roles.join(" ")}>
                        <span className="lens-badge absolute top-4 right-4 h-5 items-center rounded-full bg-accent-soft px-2 font-mono text-[10px] text-accent">
                          relevant
                        </span>
                        <h4 className="pr-16 text-[15.5px] font-semibold">{s.title}</h4>
                        <p className="mt-2 text-[14.5px] leading-relaxed text-fg-2">{s.body}</p>
                        <ul className="mt-4 flex flex-wrap gap-1.5">
                          {s.tags.map((t) => (
                            <li key={t} className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-fg-3">
                              {t}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
                {e.highlights && (
                  <>
                    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
                      {e.highlights.map((h) => (
                        <div key={h.label} className="flex flex-col gap-1 bg-surface p-4">
                          <dt className="order-2 text-[13px] leading-snug text-fg-2">{h.label}</dt>
                          <dd className="order-1 text-[1.6rem] leading-none font-semibold tracking-[-0.03em] tabular-nums">{h.value}</dd>
                          <dd className="order-3 text-[11.5px] leading-snug text-fg-4">{h.context}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[11px] text-fg-4" aria-label="Disciplines">
                      {["Computer vision", "IoT sensing", "Embedded control", "Automation", "Analytics"].map((t, i, a) => (
                        <span key={t} className="flex items-center gap-2">
                          <span className="rounded-md border border-line bg-surface px-2 py-1 text-fg-2">{t}</span>
                          {i < a.length - 1 && <span aria-hidden>+</span>}
                        </span>
                      ))}
                    </div>
                  </>
                )}
                {e.bullets && (
                  <ul className="mt-5 flex flex-col gap-2">
                    {e.bullets.map((b) => (
                      <li key={b.text} className="lens-hl flex gap-3 rounded-lg border border-transparent px-2 py-1.5 text-[14.5px] leading-relaxed text-fg-2" data-roles={b.roles.join(" ")}>
                        <span className="mt-2.5 size-1 shrink-0 rounded-full bg-fg-4" aria-hidden />
                        {b.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </ol>

        <details className="group mt-6 rounded-[var(--radius-card)] border border-line bg-surface">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-[15px] font-medium sm:px-8 [&::-webkit-details-marker]:hidden">
            <span>
              Earlier research &amp; engineering
              <span className="ml-2 font-normal text-fg-4">{earlier.length} roles</span>
            </span>
            <ChevronDown size={18} className="text-fg-3 transition-transform duration-200 group-open:rotate-180" aria-hidden />
          </summary>
          <ul className="grid grid-cols-1 gap-px border-t border-line bg-line md:grid-cols-3">
            {earlier.map((e) => (
              <li key={e.id} className="bg-surface p-6 sm:p-8">
                <p className="font-mono text-[11.5px] text-fg-4">{e.end ? `${e.start} — ${e.end}` : e.start}</p>
                <h3 className="mt-2 text-[16px] font-semibold">{e.org}</h3>
                <p className="text-[14px] text-fg-3">{e.role}</p>
                <p className="mt-3 text-[14.5px] leading-relaxed text-fg-2">{e.summary}</p>
                <p className="mt-3 font-mono text-[11px] text-fg-4">{e.stack.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-24 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeader
          id="skills-title"
          eyebrow="Skills"
          title="What I work with."
        />
        <SkillCategories categories={buildSkillCategories()} />
      </div>
    </section>
  );
}

export function ResearchPreview() {
  const featured = publications.filter((p) => p.featured).slice(0, 4);
  return (
    <section aria-labelledby="research-title" className="border-t border-line bg-bg-subtle py-24 sm:py-32">
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <div>
          <p className="eyebrow mb-4">Research</p>
          <h2 id="research-title" className="h-section">
            Engineering backed by research.
          </h2>
          <div className="mt-8 flex items-baseline gap-3">
            <span className="text-[4.5rem] leading-none font-semibold tracking-[-0.05em]">
              <CountUp value={10} />
            </span>
            <span className="text-[16px] leading-snug text-fg-2">
              IEEE publications
              <span className="block text-[13px] text-fg-4">2022 – 2024 · one as first author</span>
            </span>
          </div>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-fg-3">
            Undergraduate research across machine learning, computer vision, healthcare analytics, IoT, blockchain, cloud security and autonomous systems.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/research" variant="secondary">
              View all research
            </ButtonLink>
            <ButtonLink href={profile.links.scholar} variant="ghost" external>
              Google Scholar
            </ButtonLink>
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {featured.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 0.05} className="card flex flex-col p-5">
              <p className="font-mono text-[11px] text-fg-4">
                {p.venueShort} · {p.domain}
              </p>
              <h3 className="mt-3 text-[16px] leading-snug font-semibold">{p.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-fg-3">{p.contribution}</p>
              <a
                href={doiUrl(p.doi)}
                target="_blank"
                rel="noreferrer"
                className="mt-auto inline-flex min-h-10 items-center gap-1 pt-4 font-mono text-[11.5px] text-fg-3 hover:text-accent"
              >
                DOI {p.doi} <ArrowUpRight size={12} aria-hidden />
                <span className="sr-only">(opens in new tab)</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Recognition() {
  return (
    <section aria-labelledby="recognition-title" className="py-24 sm:py-32">
      <div className="container-page">
        <SectionHeader id="recognition-title" eyebrow="Recognition" title="Placed, published, ranked." />
        <ul className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {awards.map((a) => {
            const body = (
              <>
                <p className="font-mono text-[11.5px] text-fg-4">{a.year}</p>
                <p className="mt-6 text-[1.75rem] leading-tight font-semibold tracking-[-0.03em]">{a.rank}</p>
                <h3 className="mt-2 text-[15px] font-medium text-fg">{a.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-fg-3">{a.detail}</p>
                <p className="mt-auto pt-6 text-[12.5px] text-fg-4">{a.context}</p>
              </>
            );
            return (
              <li key={a.id} className="flex bg-surface">
                {a.href ? (
                  <Link href={a.href} className="group flex w-full flex-col p-6 transition-colors hover:bg-surface-2">
                    {body}
                  </Link>
                ) : (
                  <div className="flex w-full flex-col p-6">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function Certifications() {
  return (
    <section id="certifications" aria-labelledby="certifications-title" className="scroll-mt-24 border-t border-line bg-bg-subtle py-20 sm:py-24">
      <div className="container-page">
        <SectionHeader id="certifications-title" eyebrow="Certifications" title="Verified credentials." />
        <ul className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {certifications.map((c) => (
            <li key={c.id} className="card flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:p-8">
              <Image
                src={c.badge.src}
                alt={c.badge.alt}
                width={c.badge.width}
                height={c.badge.height}
                sizes="112px"
                className="size-24 shrink-0 sm:size-28"
              />
              <div className="min-w-0">
                <p className="font-mono text-[11.5px] text-fg-4">
                  Issued {c.issued}
                  {c.expires ? ` · Expires ${c.expires}` : ""}
                </p>
                <h3 className="mt-2 text-[1.25rem] leading-snug font-semibold tracking-[-0.02em]">{c.name}</h3>
                <p className="mt-1 text-[14.5px] text-fg-2">Issued by {c.issuer}</p>
                <p className="mt-3 text-[14.5px] leading-relaxed text-fg-3">{c.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Skills covered">
                  {c.skills.map((s) => (
                    <li key={s} className="rounded-md border border-line px-2 py-0.5 text-[12.5px] text-fg-2">
                      {s}
                    </li>
                  ))}
                </ul>
                <a
                  href={c.verifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex min-h-10 items-center gap-1.5 text-[14px] font-medium text-fg hover:text-accent"
                >
                  Verify on Credly <ArrowUpRight size={14} aria-hidden />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function EducationSection() {
  return (
    <section aria-labelledby="education-title" className="border-t border-line py-20 sm:py-24">
      <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <div>
          <p className="eyebrow mb-4">Education</p>
          <h2 id="education-title" className="text-[2rem] leading-tight font-semibold tracking-[-0.03em] sm:text-[2.5rem]">
            From circuits to data systems.
          </h2>
        </div>
        <ul className="flex flex-col">
          {education.map((e) => (
            <li key={e.id} className="grid grid-cols-1 gap-2 border-t border-line py-6 last:border-b sm:grid-cols-[1fr_auto] sm:gap-8">
              <div>
                <h3 className="text-[18px] font-semibold">{e.school}</h3>
                <p className="mt-1 text-[15px] text-fg-2">{e.degree}</p>
                <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-fg-3">{e.detail}</p>
              </div>
              <div className="font-mono text-[12px] text-fg-4 sm:text-right">
                <p>{e.period}</p>
                {e.gpa && <p className="mt-1 text-fg-2">GPA {e.gpa}</p>}
                <p className="mt-1">{e.location}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ContactCTA() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 border-t border-line">
      <div className="container-page py-24 sm:py-36">
        <p className="eyebrow mb-6">Contact</p>
        <h2 id="contact-title" className="display max-w-[16ch] !text-[clamp(2.5rem,6vw,5rem)]">
          Let&apos;s build something useful.
        </h2>
        <p className="lede mt-6 max-w-xl">
          I&apos;m looking for full-time AI, ML, and data engineering roles. The fastest way to reach me is email.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <ButtonLink href={`mailto:${profile.email}`} variant="primary" download={false}>
            {profile.email}
          </ButtonLink>
          <CopyEmail email={profile.email} />
        </div>
        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[15px]">
          {[
            { href: profile.links.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
            { href: profile.links.github, label: "GitHub", Icon: GitHubIcon },
            { href: profile.links.scholar, label: "Google Scholar", Icon: ScholarIcon },
          ].map(({ href, label, Icon }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noreferrer" className="group inline-flex min-h-11 items-center gap-2 text-fg-2 hover:text-fg">
                <Icon size={16} /> {label}
                <ArrowRight size={14} className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                <span className="sr-only">(opens in new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
