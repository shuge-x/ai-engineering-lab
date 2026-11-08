const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, permissions: ["clipboard-read", "clipboard-write"] });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  try {
    await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });

    const homeCards = page.locator(".story-card[data-playbook]");
    if (await homeCards.count() !== 6) throw new Error("Task entry must show six Team Task Board scenarios");

    await page.locator('.story-card[data-playbook="feature-development"]').click();
    await page.getByRole("heading", { name: "从需求到完整功能" }).waitFor();
    if (await page.locator(".practice-section-button").count() !== 8) throw new Error("Playbook detail must show eight teaching chapters");

    await page.locator('[data-practice-section="execution"]').click();
    await page.locator(".practice-flow-svg").waitFor();
    if (await page.locator(".practice-step-nav button").count() < 4) throw new Error("Execution section must expose workflow steps");

    await page.locator(".practice-step-nav [data-practice-step='1']").click();
    await page.locator(".trace-row.active .trace-event").waitFor();
    const activeBefore = (await page.locator(".trace-row.active .trace-event").textContent()).trim();

    await page.locator("[data-play]").click();
    await page.waitForFunction(
      (before) => document.querySelector(".trace-row.active .trace-event")?.textContent?.trim() !== before,
      activeBefore,
      { timeout: 7000 }
    );

    await page.locator("[data-play]").click(); // pause after verifying one automatic stage transition
    await page.locator('[data-practice-tab="agent"]').click();
    await page.getByText("Agent 应该怎样工作", { exact: false }).waitFor().catch(() => {});
    await page.locator('[data-practice-tab="artifact"]').click();
    await page.locator('[data-practice-tab="sources"]').click();
    await page.locator('[data-practice-tab="command"]').click();
    await page.locator("[data-copy-practice-prompt]").click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    if (!copied.toLowerCase().includes("tracer-bullet tickets")) throw new Error("Practice prompt copy did not copy the current step prompt");

    await page.locator('[data-page="playbooks"]').first().click();
    await page.getByRole("heading", { name: "把工程知识" }).waitFor();
    await page.locator('.story-card[data-playbook="feature-development"]').click();
    await page.getByRole("heading", { name: "从需求到完整功能" }).waitFor();

    await page.locator(".practice-related-footer [data-lesson]").first().click();
    await page.locator(".lesson-canvas-head h1").waitFor();

    if (pageErrors.length) throw new Error("Browser errors: " + pageErrors.join("; "));
    process.stdout.write("PASS: six scenarios, eight chapters, playbook route, step playback, prompt copy, hub route and knowledge link.\n");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  process.stderr.write(error.stack + "\n");
  process.exit(1);
});
