const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, permissions: ["clipboard-read", "clipboard-write"] });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  try {
    await page.goto(process.env.LAB_BASE_URL || "http://127.0.0.1:4173", { waitUntil: "networkidle" });

    const homeCards = page.locator(".story-card[data-playbook]");
    if (await homeCards.count() !== 6) throw new Error("Task entry must show six Team Task Board scenarios");
    const playbookIds = await homeCards.evaluateAll((cards) => cards.map((card) => card.dataset.playbook));

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
    await page.locator('[data-practice-tab="artifact"]').click();
    await page.locator('[data-practice-tab="sources"]').click();
    await page.locator('[data-practice-tab="command"]').click();
    await page.locator("[data-copy-command]").click();
    if (await page.evaluate(() => navigator.clipboard.readText()) !== "/to-tickets") throw new Error("Invocation command copy did not match the current step");
    await page.locator("[data-copy-practice-prompt]").click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    if (!copied.toLowerCase().includes("tracer-bullet tickets")) throw new Error("Practice prompt copy did not copy the current step prompt");

    await page.locator(".practice-related-footer [data-lesson]").first().click();
    await page.locator(".lesson-canvas-head h1").waitFor();
    await page.locator(".context-return").click();
    await page.getByRole("heading", { name: "从需求到完整功能" }).waitFor();
    if (await page.locator('[data-practice-section="execution"].active').count() !== 1) throw new Error("Knowledge jump did not preserve the Playbook section");
    if ((await page.locator(".trace-row.active .trace-event").textContent()).trim() !== "拆分纵向 Tickets") throw new Error("Knowledge jump did not preserve the Playbook step");

    await page.locator('[data-practice-tab="artifact"]').click();
    await page.locator('[data-practice-section="acceptance"]').click();
    await page.locator(".practice-related [data-lesson]").first().click();
    if (await page.locator("[data-practice-return]").count() !== 1) throw new Error("Acceptance chapter knowledge link has no return to the Playbook");
    await page.locator(".directory-topic-button[data-lesson]").last().click();
    await page.locator("[data-practice-return]").click();
    if (await page.locator('[data-practice-section="acceptance"].active').count() !== 1) throw new Error("Nested knowledge navigation lost the originating chapter");
    if (await page.locator('[data-practice-tab="artifact"].active').count() !== 1) throw new Error("Knowledge navigation lost the guide tab");
    if ((await page.locator(".trace-row.active .trace-event").textContent()).trim() !== "拆分纵向 Tickets") throw new Error("Knowledge navigation lost the execution step");

    await page.locator('[data-page="playbooks"]').first().click();
    await page.getByRole("heading", { name: "把工程知识" }).waitFor();
    await page.locator('.story-card[data-playbook="feature-development"]').click();
    await page.getByRole("heading", { name: "从需求到完整功能" }).waitFor();

    await page.locator("[data-practice-mark]").click();
    if (!(await page.locator("#progress-count").textContent()).startsWith("1 /")) throw new Error("Playbook progress did not persist locally");

    for (const id of playbookIds) {
      await page.locator(".brand").click();
      await page.locator(`.story-card[data-playbook="${id}"]`).click();
      const title = await page.locator(".lesson-canvas-head h1").textContent();
      const scenario = await page.locator(".practice-chapter").textContent();
      if (await page.locator(".practice-section-button").count() !== 8) throw new Error("Missing chapters in " + id);
      await page.locator('.topbar [data-page="playbooks"]').click();
      await page.locator(`.story-card[data-playbook="${id}"]`).click();
      if (await page.locator(".lesson-canvas-head h1").textContent() !== title || await page.locator(".practice-chapter").textContent() !== scenario) throw new Error("Home and hub routes disagree for " + id);
      await page.locator("[data-practice-mark]").click();
      if (id === "quick-change") {
        await page.locator('[data-practice-section="preparation"]').click();
        await page.getByRole("heading", { name: "第一次跟做：按这个顺序操作" }).waitFor();
        if (!(await page.locator(".practice-prep-code").first().textContent()).includes("git switch -c codex/story-01-empty-state")) throw new Error("Story 01 does not create a learner branch");
        await page.locator('[data-practice-section="artifacts"]').click();
        const images = page.locator(".practice-evidence img");
        if (await images.count() !== 3) throw new Error("Story 01 is missing before/after evidence");
        for (const image of await images.all()) {
          await image.scrollIntoViewIfNeeded();
          await image.evaluate((node) => node.decode());
        }
      }
      if (id === "requirements-discovery") {
        await page.locator('[data-practice-section="preparation"]').click();
        await page.getByRole("heading", { name: "第一次跟做：按这个顺序操作" }).waitFor();
        if (!(await page.locator(".practice-prep-code").first().textContent()).includes("git switch -c codex/story-02-reminder-discovery")) throw new Error("Story 02 does not create a learner branch");
        await page.locator('[data-practice-section="artifacts"]').click();
        await page.getByText("以下对话和候选规则由课程作者编写", { exact: false }).first().waitFor();
        const rounds = page.locator(".practice-interview details");
        if (await rounds.count() !== 8 || await page.locator(".practice-interview details[open]").count()) throw new Error("Story 02 must start with eight collapsed teaching rounds");
        const answer = rounds.first().locator("p").first();
        if (await answer.isVisible()) throw new Error("Teaching answer is exposed before expanding its question");
        const before = await page.evaluate(() => ({ progress: JSON.stringify(localStorage), step: document.querySelector(".trace-row.active .trace-event").textContent }));
        const question = rounds.first().locator("summary");
        await question.focus();
        await question.press("Enter");
        await answer.waitFor({ state: "visible" });
        if (!(await answer.textContent()).includes("主动订阅任务提醒的个人")) throw new Error("Story 02 answer does not match the author example");
        await question.press("Enter");
        await answer.waitFor({ state: "hidden" });
        const after = await page.evaluate(() => ({ progress: JSON.stringify(localStorage), step: document.querySelector(".trace-row.active .trace-event").textContent }));
        if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error("Expanding a teaching round changed learning progress or execution stage");
      }
      if (["feature-development", "large-architecture", "complex-bug", "safe-refactor"].includes(id)) {
        await page.locator('[data-practice-section="preparation"]').click();
        await page.getByRole("heading", { name: "第一次跟做：按这个顺序操作" }).waitFor();
        if ((await page.locator(".practice-walkthrough").textContent()).includes("undefined")) throw new Error(id + " walkthrough contains undefined content");
        const prep = await page.locator(".practice-prep-code").first().textContent();
        if (!prep.includes("git switch -c codex/")) throw new Error(id + " does not create a learner branch");
        await page.locator('[data-practice-section="artifacts"]').click();
        if (await page.locator(".practice-artifact-list article").count() < 3) throw new Error(id + " is missing reference artifacts");
        if (!(await page.locator(".practice-artifact-list").textContent()).includes("参考 tag")) throw new Error(id + " does not disclose its reference tag");
      }
    }
    if (await page.locator("#progress-count").textContent() !== "6 / 28") throw new Error("Completing a route twice changed the completion count");
    await page.reload({ waitUntil: "networkidle" });
    if (await page.locator("#progress-count").textContent() !== "6 / 28") throw new Error("Saved completion was lost on reload");
    for (const id of playbookIds) {
      await page.locator('.topbar [data-page="playbooks"]').click();
      await page.locator(`.story-card[data-playbook="${id}"]`).click();
      if (!(await page.locator("[data-practice-mark]").textContent()).includes("已完成")) throw new Error("Completion is not shared by both entry points for " + id);
    }
    const isolatedContext = await browser.newContext();
    try {
      const isolatedPage = await isolatedContext.newPage();
      await isolatedPage.goto(process.env.LAB_BASE_URL || "http://127.0.0.1:4173", { waitUntil: "networkidle" });
      if (await isolatedPage.locator("#progress-count").textContent() !== "0 / 28") throw new Error("Completion leaked into another browser context");
    } finally {
      await isolatedContext.close();
    }

    await page.locator("#search").fill("用 CodeGraph 安全改进代码结构");
    await page.getByRole("heading", { name: "用 CodeGraph 安全改进代码结构", exact: true }).waitFor();
    await page.locator('[data-practice-section="execution"]').click();
    await page.locator('.practice-step-nav [data-practice-step="2"]').click();
    await page.locator("#search").fill("Spec 规格设计");
    await page.getByRole("heading", { name: "Spec 规格设计", exact: true }).waitFor();
    await page.locator("[data-practice-return]").click();
    if ((await page.locator(".trace-row.active .trace-event").textContent()).trim() !== "选择一个重构目标") throw new Error("Searching knowledge lost the Playbook position");
    const searchPage = await context.newPage();
    try {
      await searchPage.goto(process.env.LAB_BASE_URL || "http://127.0.0.1:4173", { waitUntil: "networkidle" });
      await searchPage.locator("#search").fill("/wayfinder");
      await searchPage.getByRole("heading", { name: "先解决未知，再设计大型架构" }).waitFor();
      await searchPage.locator("#search").fill("story-05-example-r2");
      await searchPage.getByRole("heading", { name: "复杂 Bug 诊断与根因定位" }).waitFor();
      await searchPage.locator("#search").fill("taskservice");
      await searchPage.getByRole("heading", { name: "用 CodeGraph 安全改进代码结构" }).waitFor();
    } finally {
      await searchPage.close();
    }

    for (const width of [320, 390, 768, 1000, 1024, 1280, 1600]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.locator(".brand").click();
      const headerOverlap = await page.evaluate(() => {
        const rects = [".brand", ".search", "#theme", ".top-categories"].map((selector) => document.querySelector(selector).getBoundingClientRect());
        return rects.some((a, i) => rects.slice(i + 1).some((b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1));
      });
      if (headerOverlap) throw new Error("Header controls overlap at " + width + "px");
      await page.locator('.story-card[data-playbook="large-architecture"]').click();
      for (const section of ["scenario", "preparation", "execution", "acceptance"]) {
        await page.locator(`[data-practice-section="${section}"]`).click();
        const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (horizontalOverflow > 2) throw new Error(`${width}px ${section} has horizontal overflow: ${horizontalOverflow}px`);
      }
      const clippedStatus = await page.locator(".trace-panel").evaluate((panel) => panel.querySelector(".trace-row.active .trace-status").getBoundingClientRect().right > panel.getBoundingClientRect().right + 1);
      if (clippedStatus) throw new Error("Execution status is clipped at " + width + "px");
      await page.locator("[data-next]").click();
      await page.locator("[data-reset]").click();
      if (width === 320 || width === 390) {
        await page.locator(".brand").click();
        await page.locator('.story-card[data-playbook="requirements-discovery"]').click();
        await page.locator('[data-practice-section="artifacts"]').click();
        await page.locator(".practice-interview summary").first().click();
        await page.locator(".practice-interview details[open] p").first().waitFor({ state: "visible" });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (overflow > 2) throw new Error(`Story 02 interview overflows at ${width}px: ${overflow}px`);
      }
    }

    if (pageErrors.length) throw new Error("Browser errors: " + pageErrors.join("; "));
    process.stdout.write("PASS: six shared routes, eight chapters, Story 01 evidence, Story 02 keyboard/mobile interview, playback, clipboard, knowledge return, local completion across reload, search, and seven responsive widths.\n");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  process.stderr.write(error.stack + "\n");
  process.exit(1);
});
