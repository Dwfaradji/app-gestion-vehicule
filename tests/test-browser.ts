// test-browser.ts
import { webkit } from "@playwright/test";

(async () => {
  const browser = await webkit.launch();
  const page = await browser.newPage();
  await page.goto("https://example.com");
  console.log(await page.title());
  await browser.close();
})();
