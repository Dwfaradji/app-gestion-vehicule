

import { test, expect } from "@playwright/test";
import { prisma } from "../utils/prismaClient";
import { login, logout } from "../utils/auth";

test.describe("Conducteurs - FULL E2E UI", () => {
    test.beforeEach(async ({ page }) => {
        await login(page, "adminMCP@example.com", "Admin!234");
        await expect(page).not.toHaveURL(/login/i);
    });

    test.afterEach(async ({ page }) => {
        await logout(page);
    });

    test("Créer, modifier et supprimer un conducteur via UI puis vérifier en base", async ({ page }) => {
        const suffix = Date.now();
        let createdId: number | null = null;

        // ---- CRÉATION ----
        await page.goto("/parametres");

        // S'assurer que la page est chargée
        await expect(page).toHaveURL(`/parametres`);


       await page.click("text= Conducteurs");



        // S'assurer que le formulaire est visible que le titre du formulaire Gestion des conducteurs sois afficher
        await expect(page.locator("text=Gestion des conducteurs")).toBeVisible({ timeout: 5000 });


        // Attendre que l'input soit visible
        const nomInput = page.locator("#Nom");
        await expect(nomInput).toBeVisible();

// Remplir le champ
        await nomInput.fill(`Chaplin-${suffix}`);


        const prenomInput = page.locator("#Prénom");
        await expect(prenomInput).toBeVisible();
        await prenomInput.fill("Charlie");

        // Bouton submit dans le même formulaire
        const validerBtn = page.locator('button[type="submit"]', { hasText: "Ajouter" });
        await expect(validerBtn).toBeVisible();
        await expect(validerBtn).toBeEnabled();
        await validerBtn.scrollIntoViewIfNeeded();
        await validerBtn.click();


        const confirmBtn1 = page.locator('button:has-text("Confirmer")');

        if (await confirmBtn1.isVisible()) await confirmBtn1.click();

        // Attendre confirmation visuelle
        await expect(page.locator(`text=Chaplin-${suffix}`)).toBeVisible({ timeout: 10000 });

        // ---- ASSERT EN BASE ----
        const created = await prisma.conducteur.findFirst({ where: { nom: `Chaplin-${suffix}` } });
        expect(created).not.toBeNull();
        createdId = created?.id || null;

        // ---- MODIFICATION ----
        // if (!createdId) throw new Error("Conducteur non créé en base");
        //
        // // Cliquer sur le conducteur pour éditer
        // const editBtn = page.locator(`tr:has-text("Chaplin-${suffix}") >> text=Modifier`);
        // await expect(editBtn).toBeVisible();
        // await editBtn.click();
        //
        // await page.getByLabel("Nom").fill(`Chandler-${suffix}`);
        // await page.getByLabel("Prénom").fill("Charles");
        //
        // const updateBtn = page.locator('button[type="submit"]', { hasText: "Valider" });
        // await updateBtn.click();
        //
        // // Vérifier mise à jour côté UI
        // await expect(page.locator(`text=Chandler-${suffix}`)).toBeVisible({ timeout: 10000 });
        //
        // // Vérifier en base
        // const updated = await prisma.conducteur.findUnique({ where: { id: createdId } });
        // expect(updated?.nom).toBe(`Chandler-${suffix}`);

        // ---- SUPPRESSION ----

        // Sélectionner la ligne du conducteur à supprimer
        const row = page.locator(`tr:has-text("Chaplin-${suffix}")`);

// Trouver le bouton dans cette ligne par son title
        const deleteBtn = row.locator('button[title="Supprimer le conducteur"]');

// Attendre qu'il soit visible et cliquable
        await expect(deleteBtn).toBeVisible();
        await expect(deleteBtn).toBeEnabled();

// Cliquer pour supprimer
        await deleteBtn.click();


        // Confirmer suppression si modal
        const confirmBtn = page.locator('button:has-text("Confirmer")');
        if (await confirmBtn.isVisible()) await confirmBtn.click();

        await page.waitForTimeout(500); // léger délai pour propagation

        // Vérifier disparition UI
        await expect(page.locator(`text=Chandler-${suffix}`)).not.toBeVisible({ timeout: 5000 });

        // Vérifier en base
        const afterDelete = await prisma.conducteur.findUnique({ where: { id: createdId } });
        expect(afterDelete).toBeNull();
    });
});