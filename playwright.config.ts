import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  // workers: process.env.CI ? 4 : undefined,
  workers: 1,

  reporter: [["list"], ["html"]],

  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",

    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ignoreHTTPSErrors: true,
    actionTimeout: 15_000,
    navigationTimeout: 20_000,
    extraHTTPHeaders: {
      "x-e2e-test": "1",
    },
  },

  webServer:
    process.env.E2E_NO_SERVER === "1"
      ? undefined
      : {
          command: "next start -p 3000",
          url: "http://localhost:3000",
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
  globalSetup: "./tests/global.setup.ts",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],
});
