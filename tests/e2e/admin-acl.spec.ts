import { test, expect } from "@playwright/test";
import { login, loginAdmin, logout } from "../utils/auth";

/**
 * 🔐 Tests du contrôle d’accès aux routes ADMIN selon le middleware
 *
 * Cas couverts :
 *  1. Utilisateur non connecté → doit voir la page de connexion /admin
 *  2. Utilisateur connecté avec rôle USER → redirigé vers /dashboard
 *  3. Administrateur avec mustChangePassword = true → redirigé vers /admin/update uniquement
 *  4. Administrateur avec mustChangePassword = false → ne peut pas accéder à /admin
 */

test.describe("Contrôle d’accès aux routes Admin", () => {
    test("1️⃣ Utilisateur non connecté accédant à /admin → voit la page de connexion admin", async ({ page }) => {
        await page.goto("/admin");
        await expect(page.getByRole("heading", { name: /Espace Admin/i })).toBeVisible();
    });

    test("2️⃣ Utilisateur avec rôle USER → redirigé vers /dashboard", async ({ page }) => {
        await login(page, "user@example.com", "User!2345");

        await page.goto("/admin");

        // Middleware → redirection automatique vers /dashboard
        await expect(page).toHaveURL(/\/dashboard$/);

        await logout(page);
    });

    test("3️⃣ Admin avec mustChangePassword = true → redirigé vers /admin/update uniquement", async ({ page }) => {
        // Simule un admin connecté avec mustChangePassword = true
        await loginAdmin(page, "admin-change@example.com", "Admin!234", true);

        // Vérifie que le formulaire de mise à jour du mot de passe est visible
        await expect(page.getByRole("heading", { name: /Mettre à jour votre mot de passe/i })).toBeVisible();

        // Essayer d’accéder à /dashboard → redirection automatique vers /admin/update
        await page.goto("/dashboard");
        await expect(page).toHaveURL("/admin/update");

        await logout(page);
    });

    test("4️⃣ Admin avec mustChangePassword = false → ne peut pas accéder à /admin", async ({ page }) => {
        // Simule un admin connecté avec mustChangePassword = false
        await login(page, "admin@example.com", "Admin!234");
        await page.goto("/admin");
        // Middleware → redirection automatique vers /dashboard
        await expect(page).toHaveURL("/dashboard");

        await logout(page);
    });
});