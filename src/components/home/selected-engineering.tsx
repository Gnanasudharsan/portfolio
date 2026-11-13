import { RoleOrderedGrid, RoleSelector } from "@/components/lens/role-lens";
import { ButtonLink, SectionHeader } from "@/components/ui/primitives";
import { ProjectCard } from "@/components/work/project-card";
import { DEFAULT_FEATURED, projects } from "@/data/projects";

export function SelectedEngineering() {
  const items = projects.map((p, i) => ({ slug: p.slug, node: <ProjectCard project={p} priority={i === 0} /> }));
  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-24 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeader
          id="work-title"
          eyebrow="Selected engineering"
          title="Systems with measured results."
          lede="Agentic AI, inference performance, real-time data platforms, MLOps, and causal research. Each one states its status plainly and shows a verified number."
          action={
            <ButtonLink href="/work" variant="secondary" size="sm">
              All projects
            </ButtonLink>
          }
        />
        <RoleSelector className="mt-12 mb-8" />
        <RoleOrderedGrid items={items} defaultOrder={DEFAULT_FEATURED} />
      </div>
    </section>
  );
}
