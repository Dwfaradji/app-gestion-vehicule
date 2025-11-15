import { Page, expect } from "@playwright/test";

export async function login(page: Page, email: string, password: string) {
  // Navigate to login
  await page.goto("/login");

  // Wait for email field to be visible (WebKit sometimes slower)
  const emailInput = page.getByPlaceholder("Votre email");
  await expect(emailInput).toBeVisible({ timeout: 10000 });
  await emailInput.click(); // ensure focus
  await emailInput.fill(email);

  // Same for password
  const passwordInput = page.getByPlaceholder("Mot de passe");
  await expect(passwordInput).toBeVisible({ timeout: 10000 });
  await passwordInput.fill(password);

  // Submit form
  await page.getByRole("button", { name: "Se connecter" }).click();

  // Wait for redirect to dashboard
  await page.waitForURL("**/dashboard", { timeout: 20000 });
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 20000 });
}

export async function logout(page: Page) {
  // Open user menu (click on the button that displays user name and role)
  const menuButton = page.locator('button:has-text("Déconnexion")');
  if (await menuButton.count()) {
    await menuButton.first().click();
  } else {
    // Fallback: open the dropdown by clicking on the user badge
    const badge = page.locator('button:has-text("ADMIN"), button:has-text("USER")');
    await badge.first().click();
  }
  // Click logout
  await page.getByRole("button", { name: "Déconnexion" }).click();

  await page.waitForURL("**/login");
}

export async function loginAdmin(
  page: Page,
  email: string,
  password: string,
  mustChangePassword: boolean,
) {
  // 1️⃣ Naviguer vers la page de connexion admin
  await page.goto("/admin");

  // await page.getByPlaceholder('Email admin').fill(email);
  // await page.getByPlaceholder('Mot de passe').fill(password);

  // 2️⃣ Remplir le formulaire de connexion
  // Email
  const emailInput = page.getByPlaceholder("Email admin");
  await expect(emailInput).toBeVisible({ timeout: 10000 });
  await emailInput.click(); // ensure focus
  await emailInput.fill(email);

  // Password
  const passwordInput = page.getByPlaceholder("Mot de passe");
  await expect(passwordInput).toBeVisible({ timeout: 10000 });
  await passwordInput.fill(password);

  // Soumission du formulaire
  await page.getByRole("button", { name: "Se connecter" }).click();

  // 5️⃣ Attendre la redirection automatique gérée par le middleware
  if (mustChangePassword) {
    await page.waitForURL("**/admin/update");
  } else {
    // Expect redirect to dashboard
    await page.waitForURL("**/dashboard");
    await expect(page).toHaveURL(/\/dashboard$/);
  }
}
