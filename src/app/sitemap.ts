import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/profile";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/work", "/research", "/about"].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const work = projects.map((p) => ({ url: `${SITE_URL}/work/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.7 }));
  return [...pages, ...work];
}
