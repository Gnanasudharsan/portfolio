import { expect, test, type Page } from "@playwright/test";

const routes = ["/", "/work", "/research", "/about", "/resume", "/work/helio", "/work/gpu-lab", "/work/cordon", "/work/ask-the-mesh"];

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  // Resource failures are tracked by URL below; Vercel Analytics only exists on Vercel.
  page.on("console", (m) => m.type() === "error" && !m.text().startsWith("Failed to load resource") && errors.push(m.text()));
  page.on("response", (r) => r.status() >= 400 && !r.url().includes("/_vercel/") && errors.push(`${r.status()} ${r.url()}`));
  return errors;
}

for (const route of routes) {
  test(`${route} renders one h1 with no console errors`, async ({ page }) => {
    const errors = trackErrors(page);
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
}

test("unknown routes return the 404 page", async ({ page }) => {
  const res = await page.goto("/work/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("no rows");
});

test("role lens reorders work and persists", async ({ page }) => {
  await page.goto("/");
  const firstCard = page.locator("#work ol > li").first().locator("h3");
  await expect(firstCard).toHaveText("Helio");
  await page.getByRole("radio", { name: "Data Engineer" }).click();
  await expect(firstCard).toHaveText("Dockline");
  await expect(page.locator("html")).toHaveAttribute("data-role", "data-eng");
  await page.reload();
  await expect(page.locator("#work ol > li").first().locator("h3")).toHaveText("Dockline");
  await page.getByRole("radio", { name: "Everything" }).click();
  await expect(firstCard).toHaveText("Helio");
});

test("theme toggle switches and persists", async ({ page, isMobile }) => {
  await page.goto("/");
  const html = page.locator("html");
  const before = await html.getAttribute("data-theme");
  await page.getByRole("button", { name: /Switch to (dark|light) theme/ }).first().click();
  await expect(html).not.toHaveAttribute("data-theme", before ?? "");
  const after = await html.getAttribute("data-theme");
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", after ?? "");
  expect(isMobile !== undefined).toBe(true);
});

test("project explorer filters and searches", async ({ page }) => {
  await page.goto("/work");
  const status = page.getByTestId("explorer-count");
  await page.getByRole("button", { name: /^Computer Vision/ }).click();
  await expect(status).toContainText("in Computer Vision");
  await expect(page.getByRole("heading", { name: "Hemorrhage Detection in Head CT" })).toBeVisible();
  await page.getByRole("button", { name: /^All\s/ }).click();
  await page.getByRole("searchbox", { name: "Search projects" }).fill("Lean 4");
  await expect(page.getByRole("heading", { name: "Polymath Swarm" })).toBeVisible();
  await page.getByRole("searchbox", { name: "Search projects" }).fill("zzzz-nothing");
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.getByRole("searchbox", { name: "Search projects" })).toHaveValue("");
});

test("command palette searches and navigates", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard shortcut is a desktop affordance");
  await page.goto("/");
  await page.keyboard.press("ControlOrMeta+k");
  const input = page.getByRole("combobox", { name: /Search projects/ });
  await expect(input).toBeFocused();
  await input.fill("cordon");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work\/cordon$/);
});

test("mobile menu opens, traps focus, and closes on Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Site menu" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await page.getByRole("button", { name: "Open menu" }).click();
  await dialog.getByRole("link", { name: "Research" }).click();
  await expect(page).toHaveURL(/\/research$/);
});

test("skip link moves focus to main content", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard flow");
  await page.goto("/about");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("résumé offers a downloadable PDF for each emphasis", async ({ page, request }) => {
  await page.goto("/resume");
  const tabs = page.getByRole("tab");
  await expect(tabs).toHaveCount(7);
  for (let i = 0; i < 7; i++) {
    await tabs.nth(i).click();
    const href = await page.getByTestId("resume-download").getAttribute("href");
    const res = await request.get(href!);
    expect(res.status(), href!).toBe(200);
    expect(res.headers()["content-type"]).toContain("pdf");
  }
});

test("external links open safely", async ({ page }) => {
  await page.goto("/work/helio");
  const links = page.locator('a[target="_blank"]');
  const n = await links.count();
  expect(n).toBeGreaterThan(5);
  for (let i = 0; i < n; i++) expect(await links.nth(i).getAttribute("rel")).toContain("noreferrer");
});

test("reduced motion still renders all content", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /reliable AI systems/ })).toBeVisible();
  await page.getByRole("heading", { name: "Evidence over hype." }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Build with rigor." })).toBeVisible();
  await ctx.close();
});
