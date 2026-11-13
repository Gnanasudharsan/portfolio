import { ogCard, ogSize } from "@/lib/og";

export const alt = "Gnanasudharsan Ashokumar — AI/ML & Data Engineer";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({ eyebrow: "Portfolio", title: "I build reliable AI systems and data platforms." });
}
