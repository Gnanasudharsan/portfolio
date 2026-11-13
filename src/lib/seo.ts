import { education } from "@/data/education";
import { profile, SITE_URL } from "@/data/profile";
import type { Project } from "@/data/types";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: SITE_URL,
    email: `mailto:${profile.email}`,
    jobTitle: profile.title,
    address: { "@type": "PostalAddress", addressLocality: "Boston", addressRegion: "MA", addressCountry: "US" },
    sameAs: [profile.links.github, profile.links.linkedin, profile.links.scholar],
    knowsAbout: ["Machine learning", "Agentic AI", "Retrieval-augmented generation", "Data engineering", "MLOps", "Causal inference"],
    alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
    hasCredential: education.map((e) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: e.degree,
      recognizedBy: { "@type": "CollegeOrUniversity", name: e.school },
    })),
  };
}

export function projectJsonLd(p: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: p.name,
    description: p.tagline,
    codeRepository: p.links.github,
    url: `${SITE_URL}/work/${p.slug}`,
    author: { "@type": "Person", name: profile.name, url: SITE_URL },
    keywords: p.stack.join(", "),
    dateCreated: String(p.year),
  };
}

/** Escapes `<` so JSON-LD can never close its script tag. */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
