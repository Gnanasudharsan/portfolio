import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: profile.name,
    short_name: "GA",
    description: profile.seo.description,
    start_url: "/",
    display: "browser",
    background_color: "#fafafa",
    theme_color: "#111111",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
