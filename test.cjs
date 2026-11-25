const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const assert = require("node:assert/strict");
const base =
  process.env.TEST_URL || "https://atmajadesna.web.id/melania-booth/";
(async () => {
  const browser = await chromium.launch({
    args: [
      "--no-sandbox",
      "--use-fake-device-for-media-stream",
      "--use-fake-ui-for-media-stream",
    ],
  });
  for (const width of [320, 375, 414, 768, 1440]) {
    const ctx = await browser.newContext({
      viewport: { width, height: 1000 },
      permissions: ["camera"],
      acceptDownloads: true,
    });
    const p = await ctx.newPage();
    let errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(base, { waitUntil: "domcontentloaded" });
    assert.equal(await p.locator(".theme-card").count(), 6);
    assert.equal(
      await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
      "overflow",
    );
    await p.screenshot({
      path:
        (process.env.ARTIFACT_DIR || "/root/.hermes/cache/scratch") +
        "/melania-" +
        width +
        ".png",
      fullPage: true,
    });
    if (width === 1440) {
      await p.locator("#start-camera").click();
      await p.waitForFunction(
        () => document.querySelector("video").videoWidth > 0,
      );
      await p.locator("#capture").click();
      await p.waitForFunction(
        () => document.querySelectorAll(".thumb").length === 4,
        {},
        { timeout: 25000 },
      );
      assert.equal(await p.locator(".thumb").count(), 4);
      await p.locator("#theme").selectOption("2");
      await p.locator("#layout").selectOption("grid");
      assert.equal(await p.locator("#result").evaluate((c) => c.height), 940);
      await p.locator("#caption").fill("test memories");
      await p.locator("#caption").blur();
      const [dl] = await Promise.all([
        p.waitForEvent("download"),
        p.locator("#download").click(),
      ]);
      assert.equal(dl.suggestedFilename(), "melania-booth.png");
      await dl.saveAs(
        (process.env.ARTIFACT_DIR || "/root/.hermes/cache/scratch") +
          "/melania-test.png",
      );
      await p.locator("#layout").selectOption("strip");
      await p.screenshot({
        path:
          (process.env.ARTIFACT_DIR || "/root/.hermes/cache/scratch") +
          "/melania-camera-result.png",
        fullPage: true,
      });
      console.log(
        "PASS fake camera -> 4 captures -> theme -> collage -> PNG download",
      );
    }
    assert.deepEqual(errors, []);
    console.log("PASS viewport", width, "no overflow/no JS errors");
    await ctx.close();
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
