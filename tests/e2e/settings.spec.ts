import { test, expect } from "@playwright/test";
import { login, logout } from "../utils/auth";

test.describe("Settings Page", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "adminMCP@example.com", "Admin!234");
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("displays settings tabs and navigates", async ({ page }) => {
    await page.goto("/parametres");
    await expect(page.getByRole("heading", { name: "Paramètres", level: 2 })).toBeVisible();

    // Check tabs
    const tabs = [
      "Véhicules",
      "Emails",
      "Mot de passe admin",
      "Paramètres entretien",
      "Utilisateurs",
      "Archivage",
      "Conducteurs",
      "Infos",
    ];

    for (const tab of tabs) {
      await expect(page.getByRole("button", { name: tab })).toBeVisible();
    }

    // Click a tab and check URL
    await page.getByRole("button", { name: "Emails" }).click();
    await expect(page).toHaveURL(/tab=Emails/);
  });
});
