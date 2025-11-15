import { defineConfig, devices } from "@playwright/test";

// E2E config for Next.js 13 App Router app-meca
// Assumptions:
// - The app runs on http://localhost:3000
// - DATABASE_URL and NEXTAUTH_SECRET are set in env (CI/CD too)
// - `npx prisma migrate deploy` has been executed before tests in CI
// - Global setup seeds deterministic users and minimal data

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
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
