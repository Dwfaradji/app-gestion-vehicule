import { test, expect } from "@playwright/test";
import { prisma } from "../utils/prismaClient";
import { login, logout } from "../utils/auth";

test.describe("Planifications - FULL E2E UI", () => {

    test.beforeEach(async ({ page }) => {
        await login(page, "adminMCP@example.com", "Admin!234");
        await expect(page).not.toHaveURL(/login/i);

        await page.goto("/planification");
        await expect(page).toHaveURL("/planification");

        await expect(page.locator("text=Planification des attributions")).toBeVisible();

    });

    test.afterEach(async ({ page }) => {
        await logout(page);
    });

    // -----------------------------------------------------------------
    // 🟢 TEST 1 — CRÉER UNE PLANIFICATION
    // -----------------------------------------------------------------
    test("Créer une planification via UI puis vérifier en base", async ({ page }) => {
        const veh = await prisma.vehicule.findFirstOrThrow();
        const driver = await prisma.conducteur.findFirstOrThrow();

        const suffix = Date.now();
        const note = `E2E create ${suffix}`;

        // ----- Ouvrir la modal -----
        await page.click("text=Nouvelle attribution");

        // Attendre que la modal s’affiche
        await expect(page.locator("text=Planifier une attribution")).toBeVisible();

        // ----- Remplir les champs -----

        // Dates & heures
        await page.locator("#startDate").fill("2025-01-01");
        await page.locator("#startTime").fill("08:00");
        await page.locator("#endDate").fill("2025-01-01");
        await page.locator("#endTime").fill("10:00");

        // Type (jour, hebdo, mois, annuel)
        await page.locator("#type").selectOption("jour");

        // Véhicule
        await page.locator("#vehiculeId").selectOption(`${veh.id}`);

        // Conducteur
        await page.locator("#conducteurId").selectOption(`${driver.id}`);

        // Nombre de tranches
        await page.locator("#nbreTranches").fill("1");

        // ----- Valider -----
        await page.locator('button:has-text("Planifier")').click();

        // // Confirmation éventuelle
        // const confirm = page.locator('button:has-text("Confirmer")');
        // if (await confirm.isVisible()) await confirm.click();

        // ----- Vérifier affichage UI -----
        await expect(page.locator(`text=${note}`)).toBeVisible({ timeout: 8000 });

        // ----- Vérifier en base -----
        const inDb = await prisma.planification.findFirst({
            where: { note }
        });

        expect(inDb).not.toBeNull();
        expect(inDb?.vehiculeId).toBe(veh.id);
        expect(inDb?.conducteurId).toBe(driver.id);
    });

    // -----------------------------------------------------------------
    // 🟢 TEST 2 — MODIFIER UNE PLANIFICATION
    // -----------------------------------------------------------------
    test("Modifier une planification via UI puis vérifier en base", async ({ page }) => {

        const veh = await prisma.vehicule.findFirstOrThrow();
        const driver = await prisma.conducteur.findFirstOrThrow();

        // On crée en base pour éviter dépendance au test précédent
        const created = await prisma.planification.create({
            data: {
                vehiculeId: veh.id,
                conducteurId: driver.id,
                startDate: new Date(),
                endDate: new Date(Date.now() + 3600000),
                note: "E2E to update",
                nbreTranches: 1,
            }
        });

        const newNote = `E2E updated ${Date.now()}`;

        await page.reload();

        const row = page.locator(`tr:has-text("E2E to update")`);
        await row.locator('button[title="Modifier la planification"]').click();

        await page.locator("#note").fill(newNote);

        await page.locator('button[type="submit"]', { hasText: "Valider" }).click();

        const confirm = page.locator('button:has-text("Confirmer")');
        if (await confirm.isVisible()) await confirm.click();

        await expect(page.locator(`text=${newNote}`)).toBeVisible({ timeout: 8000 });

        const updated = await prisma.planification.findUnique({ where: { id: created.id } });
        expect(updated?.note).toBe(newNote);
    });

    // -----------------------------------------------------------------
    // 🟢 TEST 3 — SUPPRIMER UNE PLANIFICATION
    // -----------------------------------------------------------------
    test("Supprimer une planification via UI puis vérifier en base", async ({ page }) => {

        const veh = await prisma.vehicule.findFirstOrThrow();
        const driver = await prisma.conducteur.findFirstOrThrow();

        const created = await prisma.planification.create({
            data: {
                vehiculeId: veh.id,
                conducteurId: driver.id,
                startDate: new Date(),
                endDate: new Date(Date.now() + 3600000),
                note: "E2E delete test",
                nbreTranches: 1,
            }
        });

        await page.reload();

        const row = page.locator(`tr:has-text("E2E delete test")`);
        const delBtn = row.locator('button[title="Supprimer la planification"]');

        await delBtn.click();

        const confirm = page.locator('button:has-text("Confirmer")');
        if (await confirm.isVisible()) await confirm.click();

        await expect(page.locator(`text=E2E delete test`)).not.toBeVisible({ timeout: 6000 });

        const inDb = await prisma.planification.findUnique({ where: { id: created.id } });
        expect(inDb).toBeNull();
    });
});