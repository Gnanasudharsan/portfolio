import { profile } from "@/data/profile";
import { education } from "@/data/education";
import { resumeExperience, type ResumeVariant } from "@/data/resume";

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2.5 border-b border-line pb-1.5 font-mono text-[11px] tracking-[0.08em] text-fg-3 uppercase print:mb-1 print:pb-0.5 print:text-[7.8pt]">{children}</h2>;
}

/** The résumé itself — one component for screen and print. */
export function ResumeDocument({ v }: { v: ResumeVariant }) {
  return (
    <div className="resume-doc text-[14.5px] leading-[1.55] text-fg-2 print:text-[8.7pt] print:leading-[1.3]">
      <header className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between print:flex-row print:items-end print:pb-2">
        <div>
          <h2 className="text-[2rem] leading-none font-semibold tracking-[-0.035em] text-fg print:text-[17pt] print:whitespace-nowrap">{profile.name}</h2>
          <p className="mt-2 text-[15px] text-fg-2 print:mt-1 print:text-[10pt]">{v.id === "general" ? profile.title : v.label} · Boston, MA</p>
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[12px] text-fg-3 sm:justify-end print:text-[7.8pt]">
          <li>
            <a href={`mailto:${profile.email}`} className="inline-flex min-h-6 items-center hover:text-fg print:min-h-0">
              {profile.email}
            </a>
          </li>
          <li>
            <a href={profile.links.linkedin} className="inline-flex min-h-6 items-center hover:text-fg print:min-h-0">
              linkedin.com/in/gnanasudharsan
            </a>
          </li>
          <li>
            <a href={profile.links.github} className="inline-flex min-h-6 items-center hover:text-fg print:min-h-0">
              github.com/Gnanasudharsan
            </a>
          </li>
        </ul>
      </header>

      <p className="mt-4 text-fg print:mt-2">{v.summary}</p>

      <section className="mt-6 print:mt-2.5">
        <H>Education</H>
        <ul className="flex flex-col gap-1.5 print:gap-0.5">
          {education.map((e) => (
            <li key={e.id} className="flex flex-col justify-between gap-x-4 sm:flex-row print:flex-row">
              <span>
                <span className="font-semibold text-fg">{e.school}</span> — {e.degree}
                {e.gpa ? ` · GPA ${e.gpa}` : ""}
              </span>
              <span className="shrink-0 font-mono text-[12px] text-fg-4 print:text-[7.8pt]">{e.period.replace("Graduating ", "").replace("Graduated ", "")}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 print:mt-2.5">
        <H>Skills</H>
        <dl className="flex flex-col gap-1 print:gap-0">
          {v.skills.map((s) => (
            <div key={s.label} className="grid grid-cols-1 gap-x-3 sm:grid-cols-[9.5rem_1fr] print:grid-cols-[1.25in_1fr]">
              <dt className="font-semibold text-fg">{s.label}</dt>
              <dd>{s.items}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-6 print:mt-2.5">
        <H>Experience</H>
        <ul className="flex flex-col gap-4 print:gap-2">
          {resumeExperience.map((e) => (
            <li key={e.org}>
              <div className="flex flex-col justify-between gap-x-4 sm:flex-row print:flex-row">
                <span>
                  <span className="font-semibold text-fg">{e.org}</span> — {e.role}, {e.place}
                </span>
                <span className="shrink-0 font-mono text-[12px] text-fg-4 print:text-[7.8pt]">{e.period}</span>
              </div>
              <ul className="mt-1.5 flex list-disc flex-col gap-1 pl-5 marker:text-fg-4 print:mt-0.5 print:gap-0">
                {e.bullets.map((b) => (
                  <li key={b.slice(0, 30)}>{b}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 print:mt-2.5">
        <H>Selected projects</H>
        <ul className="flex flex-col gap-4 print:gap-2">
          {v.projects.map((p) => (
            <li key={p.slug}>
              <div className="flex flex-col justify-between gap-x-4 sm:flex-row print:flex-row">
                <a href={`/work/${p.slug}`} className="font-semibold text-fg hover:text-accent">
                  {p.title}
                </a>
                <span className="shrink-0 font-mono text-[12px] text-fg-4 print:text-[7.8pt]">{p.period}</span>
              </div>
              <ul className="mt-1.5 flex list-disc flex-col gap-1 pl-5 marker:text-fg-4 print:mt-0.5 print:gap-0">
                {p.bullets.map((b) => (
                  <li key={b.slice(0, 30)}>{b}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 print:mt-2.5">
        <H>Research & recognition</H>
        <p>
          10 co-authored IEEE conference papers (2022–2024) across ML, computer vision, healthcare analytics, IoT, blockchain and cloud security ·
          3rd place, MLOps Expo at Google Cambridge (Charlie, team) · SAUVC 2022: 6th globally, 2nd nationally · IEEE Xtreme 15.0: #95 national,
          #508 of 12,900 global.
        </p>
      </section>
    </div>
  );
}
