import { test, expect } from "@playwright/test";
import { login, logout } from "../utils/auth";

// Navigation flows between pages using dashboard cards and links

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
      await login(page, "adminMCP@example.com", "Admin!234");
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("dashboard cards navigate to target pages", async ({ page }) => {
    // Vehicules card
    await page.getByText("Véhicules", { exact: true }).click();
    await page.waitForURL("**/vehicules");
    await expect(page.getByRole("heading", { name: "Gestion des Véhicules" })).toBeVisible();

    // Back to dashboard
    await page.goto("/dashboard");

    // Trajets
    await page.getByText("Trajets", { exact: true }).click();
    await page.waitForURL("**/gestions-trajet");

    // Back
    await page.goto("/dashboard");

    // Planification
    await page.getByText("Planification", { exact: true }).click();
    await page.waitForURL("**/planification");

    // Back
    await page.goto("/dashboard");

    // Dépenses
    await page.getByText("Dépenses", { exact: true }).click();
    await page.waitForURL("**/vehicules/depenses");
  });
});
