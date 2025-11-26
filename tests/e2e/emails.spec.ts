import { test, expect, Page } from "@playwright/test";
import { prisma } from "../utils/prismaClient";
import { login, logout } from "../utils/auth";

// async function createEmail({page:Page}: { page: Page}) {
//     const page =Page
//     const suffix = Date.now();
//     const email = `ui-create-${suffix}@example.com`;
//
//     await page.click("text=Ajouter un email");
//     const emailInput = page.locator("#Email");
//
//     await emailInput.fill(email);
//     await page.locator('button[type="submit"]', { hasText: "Valider" }).click();
//
//     const confirm = page.locator('button:has-text("Confirmer")');
//     if (await confirm.isVisible()) await confirm.click();
//
//     await expect(page.locator(`text=${email}`)).toBeVisible();
//
//     const created = await prisma.email.findFirst({ where: { adresse: email } });
//     expect(created).not.toBeNull();
//
//     return {
//         email,
//         created
//     };
// }

test.describe("Emails - FULL E2E UI", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "adminMCP@example.com", "Admin!234");
    await expect(page).not.toHaveURL(/login/i);
    await page.goto("/parametres");
    await expect(page).toHaveURL(`/parametres`);
    await page.click("text=Emails");
    await expect(page.locator("text=Emails de notification")).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  // -------------------------------------------------------
  // 🟢 TEST 1 : CRÉER
  // -------------------------------------------------------
  test("Créer un email et verifier si est dans la liste via UI puis vérifier en base", async ({
    page,
  }) => {
    const suffix = Date.now();
    const email = `ui-create-${suffix}@example.com`;

    await page.click("text=Ajouter un email");
    const emailInput = page.locator("#Email");

    await emailInput.fill(email);
    await page.locator('button[type="submit"]', { hasText: "Valider" }).click();

    const confirm = page.locator('button:has-text("Confirmer")');
    if (await confirm.isVisible()) await confirm.click();

    await expect(page.locator(`text=${email}`)).toBeVisible();

    const created = await prisma.email.findFirst({ where: { adresse: email } });
    expect(created).not.toBeNull();

    // --- vérifier qu'il apparaît ---
    await expect(page.locator(`text=${email}`)).toBeVisible();
  });

  // -------------------------------------------------------
  // 🟢 TEST 2 : LISTER
  // -------------------------------------------------------

  // -------------------------------------------------------
  // 🟢 TEST 3 : MODIFIER
  // -------------------------------------------------------
  // test("Modifier un email via UI puis vérifier en base", async ({ page }) => {
  //     const suffix = Date.now();
  //     const updatedEmail = `ui-update-new-${suffix}@example.com`;
  //
  //     // --- créer un email ---
  //     const {email,created} = await createEmail({page});
  //
  //     // --- afficher la liste ---
  //     const row = page.locator(`tr:has-text("${email}")`);
  //     await row.locator('button[title="Modifier l\'email"]').click();
  //
  //     const input = page.getByLabel("Adresse");
  //     await input.fill(updatedEmail);
  //
  //     await page.locator('button[type="submit"]', { hasText: "Valider" }).click();
  //     const confirm = page.locator('button:has-text("Confirmer")');
  //     if (await confirm.isVisible()) await confirm.click();
  //
  //     await expect(page.locator(`text=${updatedEmail}`)).toBeVisible();
  //
  //     const updated = await prisma.email.findUnique({ where: { id: created.id } });
  //     expect(updated?.adresse).toBe(updatedEmail);
  // });
});
