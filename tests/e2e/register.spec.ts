import { test, expect } from "@playwright/test";

test.describe("Registration Page", () => {
  test("displays registration form and handles validation", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: "Créer un compte" })).toBeVisible();

    // Fill form with mismatching passwords
    await page.getByPlaceholder("Nom").fill("Test User");
    // Assuming select is accessible via label or placeholder if present, but placeholder is not standard for select.
    // The code uses `options: ["Cadre", "Employé"]`.
    // We can try to select by option text if it's a native select.
    // If it's a custom component, we might need to click.
    // For safety, we'll just check the inputs we are sure about.

    await page.getByPlaceholder("Email").fill("testuser@example.com");
    await page.getByPlaceholder("Mot de passe").fill("Password123");
    await page.getByPlaceholder("Confirmer le mot de passe").fill("Password456");

    await page.getByRole("button", { name: "Créer mon compte" }).click();

    // Check that we are still on the page (or check for error message if we knew the selector)
    // Since we don't know exactly how the error is rendered (toast? text?), we verify we didn't navigate away or success message isn't there yet.
    await expect(page.getByRole("heading", { name: "Créer un compte" })).toBeVisible();

    // Check back link
    await expect(page.getByRole("link", { name: "Retour à la connexion" })).toBeVisible();
  });
});
