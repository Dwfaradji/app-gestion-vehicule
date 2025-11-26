import { test, expect } from "@playwright/test";
import { login, logout } from "../utils/auth";

test.describe("Help Page", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "adminMCP@example.com", "Admin!234");
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("displays help content and FAQ", async ({ page }) => {
    await page.goto("/aide");
    await expect(page.getByRole("heading", { name: "Aide & FAQ" })).toBeVisible();

    // Check for FAQ items
    const faqQuestion = page.getByText("Comment ajouter un véhicule ?");
    await expect(faqQuestion).toBeVisible();

    // Expand FAQ
    await faqQuestion.click();
    await expect(page.getByText("Allez dans la section 'Véhicules'")).toBeVisible();

    // Check contact section
    await expect(page.getByText("Besoin de plus d'aide ?")).toBeVisible();
    await expect(page.getByRole("link", { name: "contact@devevoke.com" })).toBeVisible();
  });
});
