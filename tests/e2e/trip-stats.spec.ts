import { test, expect } from "@playwright/test";
import { login, logout } from "../utils/auth";

test.describe("Trip Statistics Page", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "adminMCP@example.com", "Admin!234");
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("displays statistics dashboard", async ({ page }) => {
    await page.goto("/statistiques-trajets");
    await expect(page.getByRole("heading", { name: "Statistiques des trajets" })).toBeVisible();

    // Check for charts and tables
    await expect(page.getByText("Graphique")).toBeVisible();
    await expect(page.getByText("Trajets Complets")).toBeVisible();

    // Check export button
    await expect(page.getByRole("button", { name: "Export PDF" })).toBeVisible();
  });
});
