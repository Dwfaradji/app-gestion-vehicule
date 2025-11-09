import { Page, expect } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  // Navigate to login
  await page.goto('/login');

  // Fill form using accessible placeholders defined in AuthForm fields
  await page.getByPlaceholder('Votre email').fill(email);
  await page.getByPlaceholder('Mot de passe').fill(password);
  await page.getByRole('button', { name: 'Se connecter' }).click();

  // Expect redirect to dashboard
  await page.waitForURL('**/dashboard');
  await expect(page).toHaveURL(/\/dashboard$/);
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
  await page.getByRole('button', { name: 'Déconnexion' }).click();
  await page.waitForURL('**/login');
}


export async function loginAdmin(
    page: Page,
    email: string,
    password: string,
    mustChangePassword: boolean
) {
    // 1️⃣ Naviguer vers la page de connexion admin
    await page.goto('/admin');

    // 2️⃣ Remplir le formulaire de connexion
    await page.getByPlaceholder('Email admin').fill(email);
    await page.getByPlaceholder('Mot de passe').fill(password);
    await page.getByRole('button', { name: 'Se connecter' }).click();


    // 5️⃣ Attendre la redirection automatique gérée par le middleware
    if (mustChangePassword) {
        await page.waitForURL('**/admin/update');
    }
}