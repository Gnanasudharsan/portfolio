import Link from "next/link";
import { ButtonLink } from "@/components/ui/primitives";
import { projects } from "@/data/projects";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[78vh] flex-col justify-center pt-32 pb-20">
      <p className="eyebrow">404 · not found</p>
      <h1 className="mt-5 max-w-[18ch] text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
        This route returned no rows.
      </h1>
      <p className="lede mt-5 max-w-xl">The page you asked for doesn&apos;t exist — or moved. Here are a few that do.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/" variant="primary">
          Home
        </ButtonLink>
        <ButtonLink href="/work" variant="secondary">
          All work
        </ButtonLink>
      </div>
      <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
        {projects.slice(0, 5).map((p) => (
          <li key={p.slug}>
            <Link href={`/work/${p.slug}`} className="link-underline text-fg-3 hover:text-fg">
              {p.short}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
