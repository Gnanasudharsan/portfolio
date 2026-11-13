import { ogCard, ogSize } from "@/lib/og";
import { projectBySlug, projects } from "@/data/projects";

export const alt = "Case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return ogCard({ eyebrow: "Case study", title: "Selected engineering" });
  return ogCard({ eyebrow: `Case study · ${p.status}`, title: p.name.split(" — ")[0] + (p.name.includes(" — ") ? ` — ${p.name.split(" — ")[1]}` : ""), metric: p.headline.value, metricLabel: p.headline.label });
}
