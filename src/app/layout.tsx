import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { CommandPalette, type PaletteItem } from "@/components/site/command-palette";
import { RoleAttributeSync } from "@/components/lens/role-lens";
import { roleScript, themeScript } from "@/lib/scripts";
import { profile, SITE_URL } from "@/data/profile";
import { projects } from "@/data/projects";
import { publications } from "@/data/research";
import { experience } from "@/data/experience";
import { jsonLd, personJsonLd } from "@/lib/seo";
import { MotionProvider } from "@/components/ui/motion";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
// Mono labels are decorative: "optional" never swaps after first paint, so they cannot shift layout.
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "optional" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: profile.seo.title, template: `%s — ${profile.name}` },
  description: profile.seo.description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: ["AI engineer", "ML engineer", "Data engineer", "MLOps", "RAG", "LangGraph", "Boston", "Northeastern"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: profile.name,
    title: profile.seo.title,
    description: profile.seo.description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: profile.seo.title, description: profile.seo.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  colorScheme: "light dark",
};

function paletteItems(): PaletteItem[] {
  return [
    { id: "p-home", group: "Pages", label: "Home", href: "/" },
    { id: "p-work", group: "Pages", label: "Selected engineering", hint: "All case studies and project library", href: "/work" },
    { id: "p-research", group: "Pages", label: "Research", hint: "10 IEEE publications", href: "/research" },
    { id: "p-about", group: "Pages", label: "About", href: "/about" },
    { id: "p-resume", group: "Pages", label: "Résumé", href: "/resume" },
    ...projects.map<PaletteItem>((p) => ({ id: `w-${p.slug}`, group: "Projects", label: p.short, hint: p.tagline, href: `/work/${p.slug}` })),
    ...experience.map<PaletteItem>((e) => ({ id: `e-${e.id}`, group: "Experience", label: `${e.org}`, hint: e.role, href: e.kind === "primary" ? "/#experience" : "/about#experience" })),
    ...publications.map<PaletteItem>((p) => ({ id: `r-${p.id}`, group: "Research", label: p.title, hint: `${p.venueShort} · ${p.domain}`, href: `/research#${p.id}` })),
    { id: "a-email", group: "Actions", label: "Copy email address", hint: profile.email, copy: profile.email },
    { id: "a-gh", group: "Actions", label: "View GitHub", href: profile.links.github, external: true },
    { id: "a-li", group: "Actions", label: "Open LinkedIn", href: profile.links.linkedin, external: true },
    { id: "a-scholar", group: "Actions", label: "Google Scholar", href: profile.links.scholar, external: true },
    { id: "a-cv", group: "Actions", label: "Download résumé (PDF)", href: "/resume/Gnanasudharsan_Ashokumar_Resume.pdf", external: true },
  ];
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript + roleScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(personJsonLd()) }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-fg px-4 py-2 text-[14px] text-bg focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" className="flex-1" tabIndex={-1}>
          <MotionProvider>{children}</MotionProvider>
        </main>
        <Footer />
        <CommandPalette items={paletteItems()} />
        <RoleAttributeSync />
        {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "1" && <Analytics />}
      </body>
    </html>
  );
}
