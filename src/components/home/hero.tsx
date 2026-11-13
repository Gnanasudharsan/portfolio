import { GitHubIcon, LinkedInIcon, ScholarIcon } from "@/components/ui/icons";
import { ButtonLink } from "@/components/ui/primitives";
import { HeroReveal } from "./hero-reveal";
import { SystemGraph } from "./system-graph";
import { profile } from "@/data/profile";

const social = [
  { href: profile.links.github, label: "GitHub", Icon: GitHubIcon },
  { href: profile.links.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: profile.links.scholar, label: "Google Scholar", Icon: ScholarIcon },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 md:pb-24">
      <div
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_30%,transparent_75%)]"
        aria-hidden
      />
      <div className="container-page relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-10">
        <div>
          <HeroReveal>
            <p className="eyebrow mb-6 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>Boston</span>
              <span aria-hidden>·</span>
              <span>AI / ML systems</span>
              <span aria-hidden>·</span>
              <span>Data engineering</span>
            </p>
            <h1 id="hero-title" className="display max-w-[14ch]">
              I build reliable AI systems and data&nbsp;platforms.
            </h1>
            <p className="lede mt-7 max-w-[38rem]">{profile.subhead}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="/work" variant="primary">
                Explore my work
              </ButtonLink>
              <ButtonLink href="/resume" variant="secondary">
                View résumé
              </ButtonLink>
              <ul className="ml-1 flex items-center gap-0.5" aria-label="Profiles">
                {social.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${label} (opens in new tab)`}
                      className="inline-flex size-11 items-center justify-center rounded-full text-fg-3 transition-colors hover:bg-surface-2 hover:text-fg"
                    >
                      <Icon size={17} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 flex flex-col gap-3 text-[14px] text-fg-3 sm:flex-row sm:items-center sm:gap-5">
              <span>{profile.credential}</span>
              <span className="hidden h-4 w-px bg-line-strong sm:block" aria-hidden />
              <span className="inline-flex items-center gap-2 text-fg-2">
                <span className="size-1.5 rounded-full bg-teal" aria-hidden />
                {profile.availability}
              </span>
            </div>
          </HeroReveal>
        </div>
        <div className="hidden lg:block">
          <HeroReveal delay={0.25}>
            <SystemGraph className="mx-auto max-w-[460px]" />
          </HeroReveal>
        </div>
        <div className="lg:hidden" aria-hidden>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11.5px] text-fg-4">
            {["Data", "Models", "Systems", "Decisions"].map((s, i, a) => (
              <span key={s} className="flex items-center gap-2">
                <span className="rounded-md border border-line bg-surface px-2.5 py-1 text-fg-2">{s}</span>
                {i < a.length - 1 && <span className="h-px w-3 bg-line-strong sm:w-5" />}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
