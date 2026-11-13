# Gnanasudharsan Ashokumar — Portfolio

Personal engineering portfolio: AI/ML systems, data platforms, MLOps and applied research.
Built with Next.js 16 (App Router, Cache Components), React 19, TypeScript (strict) and Tailwind CSS 4.

Every number on the site comes from a repository file, a published paper, or a résumé statement, and each
one is labeled **measured**, **target** or **reported**. Measured numbers link to their source file.

## Local setup

```bash
npm install
npm run dev            # http://localhost:3000
```

Requires Node 20.9 or newer.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` · `npm run typecheck` | ESLint (Next core-web-vitals) · `tsc --noEmit` |
| `npm test` | Vitest content-integrity tests (sources, slugs, DOIs, images, no phone number) |
| `npm run test:e2e` | Playwright: routes, 404 status, role lens, theme, explorer, palette, mobile menu, PDFs |
| `npm run resume:pdf` | Prints every résumé variant from the running site to `public/resume/*.pdf` |
| `npm run check` | lint + typecheck + unit tests |

Regenerate the résumé PDFs after changing `src/data/resume.ts`:

```bash
npm run build && npm start -- -p 3300 &
BASE=http://localhost:3300 npm run resume:pdf
```

## Routes

| Route | Content |
| --- | --- |
| `/` | Hero + discipline graph, credibility strip, Selected Engineering (role lens), philosophy, experience, skills, research, recognition, education, contact |
| `/work` | All ten case studies, then a searchable, filterable project library |
| `/work/[slug]` | Case study: problem, build, architecture diagram, contribution, decisions, results/charts, reliability, limitations, lessons |
| `/research` | Ten IEEE papers by year, with DOIs, methods and code links |
| `/about` | Career path (electronics → agentic AI), philosophy, full experience, education, recognition |
| `/resume` | HTML résumé with seven emphases; each downloads as a one-page PDF |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, OG/Twitter images | SEO surface |

Unknown `/work/*` slugs get a real 404 from `src/proxy.ts`.

## Source-of-truth content

All copy lives in `src/data/`. Pages contain no hard-coded content.

| File | Holds |
| --- | --- |
| `profile.ts` | Name, links, hero copy, credibility numbers, philosophy, career path |
| `projects/*.ts` | One file per case study: metrics (with `kind` and `source`), architecture graph, decisions, charts, findings, caveats, role weights |
| `library.ts` | Smaller projects for the explorer |
| `experience.ts` · `education.ts` · `awards.ts` | Career, degrees, recognition |
| `research.ts` | Publications, with DOIs taken from the IEEE PDFs |
| `skills.ts` | Skill groups, each linked to the projects that use it |
| `roles.ts` | Role-lens orderings, default filters and skill emphasis |
| `resume.ts` | Résumé variants |
| `project-slugs.ts` | Slug list used by the 404 proxy (a unit test keeps it in sync) |

To add a project, create `src/data/projects/<slug>.ts`, export it from `projects/index.ts`, add the slug to
`project-slugs.ts` and any role orders, then run `npm test`.

## Design system

- **Type:** Geist and Geist Mono through `next/font`, self-hosted. Display sizes use `clamp()` with tight
  tracking. Mono is only for labels and metrics, and uses `display: optional` so it can't shift layout.
- **Color:** tokens on `:root` and `[data-theme="dark"]` in `globals.css`. Surfaces are neutral porcelain and
  graphite, with one blue accent. Teal means *measured* or *live*, amber means *target* or *fragile*. Every
  text token passes WCAG AA on its surfaces.
- **Layout:** 1280px container, a 12-column editorial grid for featured work, and container-query cards that
  change layout with the slot they're in. Every grid has an explicit base column, so content can't push the
  layout wider than the viewport.
- **Motion:** CSS for the hero entrance and scroll reveals (IntersectionObserver). Motion is used only for
  role-lens reordering, explorer filtering and the selector pill. Everything honors `prefers-reduced-motion`.
- **Signature interaction:** the discipline graph in the hero. Each edge is a real project that joins two
  disciplines, and it reacts to pointer, hover and focus.
- **Role lens:** reorders featured work, sets the explorer's default filter and the résumé emphasis, and
  highlights relevant experience and skills through `<html data-role>`. These are CSS-only highlights, so
  server-rendered sections stay static. The choice persists in `localStorage`.

## Quality (Lighthouse 12, against the live Vercel deployment)

| Route | Mobile perf | Desktop perf | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- | --- |
| `/` | 97 | 100 | 100 | 100 | 100 |
| `/work` | 98 | 100 | 100 | 100 | 100 |
| `/work/helio` | 100 | 100 | 100 | 100 | 100 |
| `/research` | 100 | 100 | 100 | 100 | 100 |
| `/resume` | 100 | 100 | 100 | 100 | 100 |

CLS is 0.000 on every route measured. Scores vary slightly between runs.

## Deployment

Live at **https://gnanaa.vercel.app**. Deployed on Vercel as a static or partially
prerendered Next.js app, with no backend or database. Pushes to `main` deploy automatically.

```bash
vercel --prod
```

Optional environment variables:

- `NEXT_PUBLIC_SITE_URL`: canonical origin used in metadata, the sitemap and JSON-LD.
- `NEXT_PUBLIC_ENABLE_ANALYTICS=1`: renders Vercel Analytics. Enable Web Analytics on the Vercel project
  first; otherwise the script returns 404.
