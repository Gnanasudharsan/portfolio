import type { Certification } from "./types";

/** Source of truth: the public Credly badge page (issuer, dates and description). */
export const certifications: Certification[] = [
  {
    id: "claude-certified-architect-foundations",
    name: "Claude Certified Architect — Foundations",
    issuer: "Anthropic",
    issued: "Nov 2026",
    issuedISO: "2026-11-15",
    expires: "Nov 2027",
    summary:
      "Credential for solution architects designing and building production-grade applications with Claude using Claude Code, the Claude Agent SDK, the Claude API, and MCP.",
    skills: ["Claude Code", "Claude Agent SDK", "Claude API", "MCP"],
    verifyUrl: "https://www.credly.com/badges/f7b7df1a-ffcc-4afe-aa55-297304512bf8",
    badge: {
      src: "/images/certifications/claude-certified-architect.png",
      alt: "Claude Certified Architect — Foundations badge issued by Anthropic",
      width: 340,
      height: 340,
    },
  },
];
