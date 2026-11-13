import type { Award } from "./types";

export const awards: Award[] = [
  {
    id: "mlops-expo",
    title: "MLOps Expo",
    detail: "Northeastern MLOps Expo hosted at Google Cambridge, for Charlie — a team project.",
    year: "2025",
    rank: "3rd place",
    context: "Charlie · conversational transit intelligence",
  },
  {
    id: "sauvc",
    title: "Singapore AUV Challenge",
    detail: "SAUVC 2022 — autonomous underwater vehicle competition among 140+ international teams.",
    year: "2022",
    rank: "6th globally · 2nd nationally",
    context: "Embedded perception & navigation",
  },
  {
    id: "ieee-pubs",
    title: "IEEE publications",
    detail: "Ten co-authored conference papers in IEEE Xplore across ML, computer vision, healthcare, IoT, blockchain and cloud security.",
    year: "2022–2024",
    rank: "10 papers",
    context: "One as first author",
    href: "/research",
  },
  {
    id: "ieee-xtreme",
    title: "IEEE Xtreme 15.0",
    detail: "24-hour global programming competition, October 2021.",
    year: "2021",
    rank: "#95 national · #508 global",
    context: "Of 12,900 participants",
  },
];
