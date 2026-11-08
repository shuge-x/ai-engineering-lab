const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  try {
    await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });
    await page.locator('[data-category="1"]').click();

    const expected = await page.evaluate(() => {
      const lesson = window.LAB_CURRICULUM.lessons.find((item) => item.id === "task-routing");
      return lesson.main.map((stage) => stage.event || stage.title);
    });

    await page.locator("[data-play]").click();

    const firstAnimation = await page.locator(".mechanism-view.flow-pulse .mechanism-edge-group.active .mechanism-link").evaluate((node) => getComputedStyle(node).animationName);
    if (firstAnimation !== "mechanism-flow") {
      throw new Error("Play did not start the active mechanism animation");
    }

    for (let index = 1; index < expected.length; index += 1) {
      await page.waitForFunction(
        (eventName) => document.querySelector(".trace-row.active .trace-event")?.textContent?.trim() === eventName,
        expected[index],
        { timeout: 7000 }
      );
    }

    const finalState = await page.locator("[data-play]").textContent();
    if (!finalState.includes("播放")) {
      throw new Error("Playback did not stop after the final stage");
    }
    if (pageErrors.length) {
      throw new Error("Browser errors: " + pageErrors.join("; "));
    }

    process.stdout.write("PASS: Play automatically advanced through " + expected.length + " stages.\n");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  process.stderr.write(error.stack + "\n");
  process.exit(1);
});
