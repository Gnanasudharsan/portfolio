import Link from "next/link";
import { GitHubIcon, LinkedInIcon, Monogram, ScholarIcon } from "@/components/ui/icons";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="no-print border-t border-line">
      <div className="container-page flex flex-col gap-10 py-12 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <Monogram size={30} className="text-fg" />
          <div>
            <p className="text-[15px] font-semibold">{profile.name}</p>
            <p className="mt-0.5 text-[14px] text-fg-3">{profile.title} · Boston, MA</p>
          </div>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2.5 text-[14px] sm:grid-cols-3">
          <Link className="text-fg-3 hover:text-fg" href="/work">
            Work
          </Link>
          <Link className="text-fg-3 hover:text-fg" href="/research">
            Research
          </Link>
          <Link className="text-fg-3 hover:text-fg" href="/about">
            About
          </Link>
          <Link className="text-fg-3 hover:text-fg" href="/resume">
            Résumé
          </Link>
          <a className="inline-flex items-center gap-1.5 text-fg-3 hover:text-fg" href={profile.links.github} target="_blank" rel="noreferrer">
            <GitHubIcon size={13} /> GitHub
          </a>
          <a className="inline-flex items-center gap-1.5 text-fg-3 hover:text-fg" href={profile.links.linkedin} target="_blank" rel="noreferrer">
            <LinkedInIcon size={12} /> LinkedIn
          </a>
          <a className="inline-flex items-center gap-1.5 text-fg-3 hover:text-fg" href={profile.links.scholar} target="_blank" rel="noreferrer">
            <ScholarIcon size={13} /> Scholar
          </a>
          <a className="text-fg-3 hover:text-fg" href={`mailto:${profile.email}`}>
            Email
          </a>
        </nav>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-line py-6 font-mono text-[11.5px] text-fg-4 sm:flex-row sm:justify-between">
        <span>© 2026 {profile.name}</span>
        <span>Built with Next.js + TypeScript · metrics link to their source</span>
      </div>
    </footer>
  );
}
