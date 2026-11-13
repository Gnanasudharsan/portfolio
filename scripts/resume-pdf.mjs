/**
 * Prints every résumé variant from the running site to public/resume/*.pdf,
 * so the downloadable files are generated from the same source as the page.
 *
 *   npm run build && npm run start -- -p 3300 &
 *   BASE=http://localhost:3300 npm run resume:pdf
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3300";
const OUT = new URL("../public/resume/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ colorScheme: "light", reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto(`${BASE}/resume`, { waitUntil: "networkidle" });

const tabs = page.getByRole("tab");
const count = await tabs.count();
for (let i = 0; i < count; i++) {
  await tabs.nth(i).click();
  const href = await page.getByTestId("resume-download").getAttribute("href");
  const file = href.split("/").pop();
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: `${OUT}${file}`, preferCSSPageSize: true, printBackground: false });
  await page.emulateMedia({ media: "screen" });
  console.log("wrote", file);
}
await browser.close();
