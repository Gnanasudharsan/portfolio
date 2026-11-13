import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/motion";
import { experience } from "@/data/experience";
import { education } from "@/data/education";
import { awards } from "@/data/awards";
import { philosophy, profile, trajectory } from "@/data/profile";

export const metadata: Metadata = {
  title: "About",
  description:
    "From electronics and embedded systems to IoT, computer vision, machine learning, data engineering, MLOps and agentic AI — background, education, and full experience.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 sm:pt-40">
      <div className="container-page">
        <p className="eyebrow mb-5">About</p>
        <h1 className="display max-w-[17ch] !text-[clamp(2.5rem,6vw,5.25rem)]">I started with circuits and worked my way up the stack.</h1>
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="prose-case max-w-2xl">
            <p>
              My engineering path began with physical systems — an electronics and communication degree, microcontrollers, sensors, and the
              Raspberry Pi and Jetson boards that turn them into something autonomous. That’s where I learned that real systems fail in boring
              ways: noisy inputs, missing data, timing, power.
            </p>
            <p>
              Each step since has moved up a layer. IoT control loops needed computer vision; computer vision needed better models; models needed
              data platforms to feed them; data platforms needed MLOps to keep them honest; and today the most interesting systems put language
              models on top of all of it. The habits carried over: measure first, design for failure, and never trust a number you can’t trace.
            </p>
            <p>
              I&apos;m finishing an M.S. in Data Analytics Engineering at Northeastern in Boston (December 2026), after a co-op shipping production
              RAG and LLM workflow systems at Intelligent DataWorks.
            </p>
          </div>
          <div className="flex flex-col gap-4 lg:items-start">
            <ButtonLink href="/resume" variant="primary">
              View résumé
            </ButtonLink>
            <ButtonLink href={`mailto:${profile.email}`} variant="secondary">
              {profile.email}
            </ButtonLink>
          </div>
        </div>

        <section aria-labelledby="path-title" className="mt-28">
          <h2 id="path-title" className="h-section max-w-xl">
            The path, layer by layer.
          </h2>
          <ol className="relative mt-12 grid grid-cols-1 gap-0 md:grid-cols-6">
            {trajectory.map((t, i) => (
              <Reveal as="li" key={t.stage} delay={i * 0.05} className="relative border-l border-line pb-8 pl-6 md:border-t md:border-l-0 md:pt-6 md:pr-5 md:pb-0 md:pl-0">
                <span
                  className="absolute top-0 -left-[5px] size-[9px] rounded-full border-2 border-bg bg-accent md:-top-[5px] md:left-0"
                  aria-hidden
                />
                <p className="font-mono text-[11px] text-fg-4">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-[15.5px] font-semibold">{t.stage}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-fg-3">{t.detail}</p>
              </Reveal>
            ))}
          </ol>
        </section>

        <section aria-labelledby="phil-title" className="mt-28 grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 id="phil-title" className="h-section">
            How I work.
          </h2>
          <ul className="flex flex-col">
            {philosophy.map((p) => (
              <li key={p.title} className="border-t border-line py-6 last:border-b">
                <h3 className="text-[1.25rem] font-semibold tracking-[-0.02em]">{p.title}</h3>
                <p className="mt-2 text-[15.5px] leading-relaxed text-fg-2">{p.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="experience" aria-labelledby="exp-title" className="mt-28 scroll-mt-28">
          <h2 id="exp-title" className="h-section">
            Experience.
          </h2>
          <ol className="mt-10 border-t border-line">
            {experience.map((e) => (
              <li key={e.id} className="grid grid-cols-1 gap-3 border-b border-line py-8 md:grid-cols-[14rem_1fr] md:gap-10">
                <div>
                  <p className="font-mono text-[12px] text-fg-4">{e.end ? `${e.start} — ${e.end}` : e.start}</p>
                  <p className="mt-1 text-[13px] text-fg-4">{e.location}</p>
                </div>
                <div>
                  <h3 className="text-[1.25rem] font-semibold tracking-[-0.02em]">{e.org}</h3>
                  <p className="text-[15px] text-fg-2">{e.role}</p>
                  <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-fg-2">{e.summary}</p>
                  {e.systems && (
                    <ul className="mt-4 flex max-w-3xl flex-col gap-2">
                      {e.systems.map((s) => (
                        <li key={s.title} className="text-[14.5px] leading-relaxed text-fg-3">
                          <span className="font-medium text-fg">{s.title}.</span> {s.body}
                        </li>
                      ))}
                    </ul>
                  )}
                  {e.bullets && (
                    <ul className="mt-4 flex max-w-3xl flex-col gap-2">
                      {e.bullets.map((b) => (
                        <li key={b.text} className="text-[14.5px] leading-relaxed text-fg-3">
                          {b.text}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-4 font-mono text-[11.5px] text-fg-4">{e.stack.join(" · ")}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="edu-title" className="mt-28 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 id="edu-title" className="h-section">
              Education.
            </h2>
            <ul className="mt-8 flex flex-col gap-4">
              {education.map((e) => (
                <li key={e.id} className="card p-6">
                  <p className="font-mono text-[12px] text-fg-4">{e.period}</p>
                  <h3 className="mt-2 text-[1.125rem] font-semibold">{e.school}</h3>
                  <p className="text-[15px] text-fg-2">
                    {e.degree}
                    {e.gpa ? ` · GPA ${e.gpa}` : ""}
                  </p>
                  <p className="mt-2 text-[14px] text-fg-3">{e.detail}</p>
                  {e.coursework && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {e.coursework.map((c) => (
                        <li key={c} className="rounded-md bg-surface-2 px-2 py-0.5 text-[12px] text-fg-3">
                          {c}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="h-section">Recognition.</h2>
            <ul className="mt-8 flex flex-col">
              {awards.map((a) => (
                <li key={a.id} className="grid grid-cols-[1fr_auto] gap-4 border-t border-line py-5 last:border-b">
                  <div>
                    <h3 className="text-[15.5px] font-semibold">
                      {a.title} <span className="font-normal text-fg-3">— {a.rank}</span>
                    </h3>
                    <p className="mt-1 text-[14px] text-fg-3">{a.detail}</p>
                  </div>
                  <span className="font-mono text-[12px] text-fg-4">{a.year}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
