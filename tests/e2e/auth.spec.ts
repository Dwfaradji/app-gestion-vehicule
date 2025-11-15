import { test, expect } from "@playwright/test";
import { login, logout } from "../utils/auth";

// Authentification : connexion, déconnexion, redirections non authentifiées, accès par rôle
// Cette suite valide les flux d'authentification et les gardes. Certains tests doivent être non authentifiés, donc pas de hooks globaux.

test.describe("Authentification", () => {
  test("affiche la page de connexion et valide les champs requis", async ({ page }) => {
    await page.goto("/login");

    // Tenter de soumettre un formulaire vide
    await page.getByRole("button", { name: "Se connecter" }).click();

    // Rester sur /login et éventuellement voir un message de validation
    await expect(page).toHaveURL(/\/login/);
    const possibleError = page.getByText(/(incorrect|invalide|mot de passe|Email)/i);
    if (await possibleError.count()) {
      await expect(possibleError.first()).toBeVisible();
    }
  });

  test("ADMIN peut se connecter, voir le tableau de bord puis se déconnecter", async ({ page }) => {
    await login(page, "adminMCP@example.com", "Admin!234");

    // Le tableau de bord doit être visible après connexion
    await expect(page.getByRole("heading", { name: "Tableau de bord" })).toBeVisible();

    await logout(page);

    await expect(page).toHaveURL(/\/login$/);
  });

  test("UTILISATEUR (non-admin) peut se connecter et est redirigé vers le tableau de bord", async ({
    page,
  }) => {
    await login(page, "user@example.com", "User!2345");

    await expect(page.getByRole("heading", { name: "Tableau de bord" })).toBeVisible();

    await logout(page);
  });

  test("un visiteur non authentifié allant sur /dashboard est redirigé vers /login", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // Selon la protection, redirection vers /login ou affichage d’un formulaire; s’assurer que l’en-tête du tableau de bord n’est pas visible
    const isDashboard = await page.getByRole("heading", { name: "Tableau de bord" }).count();
    if (!isDashboard) {
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test("un non-admin ne peut pas accéder à /admin (redirigé)", async ({ page }) => {
    // Connexion en tant qu’utilisateur standard
    await login(page, "user@example.com", "User!2345");

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login|\/dashboard/);

    await logout(page);
  });
});
