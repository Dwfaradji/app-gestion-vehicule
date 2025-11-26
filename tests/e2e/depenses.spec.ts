import { test, expect } from "@playwright/test";
import { prisma } from "../utils/prismaClient";
import { login, logout } from "../utils/auth";

test.describe("Dépenses - FULL E2E UI", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "adminMCP@example.com", "Admin!234");
    await expect(page).not.toHaveURL(/login/i);
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("Créer une dépense via UI puis vérifier en base", async ({ page }) => {
    // ---- ARRANGE ----
    const veh = await prisma.vehicule.findFirstOrThrow();
    const uniqueNote = `UI E2E Note ${Date.now()}`;

    // ---- ACT ----
    await page.goto(`/vehicules/${veh.id}`);
    await expect(page).toHaveURL(`/vehicules/${veh.id}`);

    await page.click("text=Mécanique");
    await page.click("text=Ajouter");

    // Remplir les champs
    await page.getByLabel("Réparation").selectOption({ label: "Freins - Plaquettes avant" });

    await page.getByLabel("Prix (€)").click();
    await page.getByLabel("Prix (€)").fill("199");

    await page.getByLabel("Kilométrage").click();
    await page.getByLabel("Kilométrage").fill("12000");

    await page.getByLabel("Date").fill("11/14/2025");

    await page.getByLabel("Note").click();
    await page.getByLabel("Note").fill(uniqueNote);

    // Sélectionner le bon intervenant via la valeur réelle du select
    await page.getByLabel("Intervenant").selectOption({ label: "Paul" });

    // Sélectionner le bouton Valider via type ou texte
    const validerBtn = page.locator('button[type="submit"]', { hasText: "Valider" });

    // Attendre qu'il soit visible et cliquable
    await expect(validerBtn).toBeVisible({ timeout: 5000 });

    // S'assurer qu'il est dans le viewport
    await validerBtn.scrollIntoViewIfNeeded();

    // Cliquer
    await validerBtn.click();

    // Attendre le message de succès pour s'assurer que l'envoi est pris en compte
    // await expect(page.locator("text=Dépense créée avec succès")).toBeVisible({ timeout: 10000 });

    // ---- ASSERT ----
    // Attendre que la dépense soit présente en base avant de vérifier
    let depenseInDb = null;
    for (let i = 0; i < 10; i++) {
      // retry 10 fois
      depenseInDb = await prisma.depense.findFirst({ where: { note: uniqueNote } });
      if (depenseInDb) break;
      await new Promise((r) => setTimeout(r, 500)); // attendre 500ms
    }

    expect(depenseInDb).not.toBeNull();
    const createdId = depenseInDb?.id || null;

    // Vérifier dans l’UI que la dépense apparaît dans la liste
    await page.goto(`/vehicules/${veh.id}`);
    await expect(page.locator(`text=${uniqueNote}`)).toBeVisible({ timeout: 10000 });

    // Corriger l'URL avec une seule accolade
    await page.goto(`/vehicules/depenses/${veh.id}`);

    // S'assurer que la page est chargée
    await expect(page).toHaveURL(`/vehicules/depenses/${veh.id}`);

    // Vérifier la visibilité de la note
    await expect(page.locator(`text=${uniqueNote}`)).toBeVisible({ timeout: 50000 });

    // ---- CLEANUP ----
    if (createdId) {
      await prisma.depense.delete({
        where: { id: createdId },
      });

      // Vérifier que le cleanup est OK
      const after = await prisma.depense.findUnique({
        where: { id: createdId },
      });
      expect(after).toBeNull();
    }
  });
});
