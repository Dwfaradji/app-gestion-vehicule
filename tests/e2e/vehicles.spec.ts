import { test, expect } from "@playwright/test";
import { prisma } from "../utils/prismaClient";
import { login, logout } from "../utils/auth";

// Véhicules : CRUD via API + vérifications d’affichage
// Cette suite couvre la liste et le CRUD des véhicules, avec la validation que le kilométrage ne peut pas diminuer.

test.describe("Véhicules", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "adminMCP@example.com", "Admin!234");
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("la page liste s’affiche et montre le véhicule de base", async ({ page }) => {
    await page.goto("/vehicules");
    await expect(page.getByRole("heading", { name: "Gestion des Véhicules" })).toBeVisible();
    await expect(page.getByText("E2E-TEST-001")).toBeVisible();
  });

  test("créer, modifier et supprimer un véhicule via l’API puis vérifier en base", async ({
    request,
  }) => {
    // Utiliser une immatriculation unique pour éviter les collisions entre exécutions
    const suffix = Date.now();
    const immat = `E2E-API-VEH-${suffix}`;

    let createdId: number | null = null;
    try {
      // Création du véhicule
      const createRes = await request.post("/api/vehicules", {
        data: {
          type: "Camion",
          constructeur: "Renault",
          modele: "Master",
          km: 5000,
          annee: 2023,
          energie: "Diesel",
          immat,
          statut: "Disponible",
        },
      });
      expect(createRes.ok()).toBeTruthy();
      const created = await createRes.json();
      createdId = created.id;
      expect(createdId).toBeTruthy();

      // Vérification BD de l’immatriculation
      const inDb = await prisma.vehicule.findUnique({ where: { id: Number(createdId) } });
      expect(inDb?.immat).toBe(immat);

      // Mise à jour: km (doit augmenter) et statut
      const updateRes = await request.put("/api/vehicules", {
        data: { id: createdId, km: 7000, statut: "Maintenance" },
      });
      expect(updateRes.ok()).toBeTruthy();
      const updated = await updateRes.json();
      expect(updated.km).toBe(7000);
      expect(updated.statut).toBe("Maintenance");

      // Cas négatif: diminuer le km doit renvoyer 400
      const invalidRes = await request.put("/api/vehicules", {
        data: { id: createdId, km: 6000 },
      });
      expect(invalidRes.status()).toBe(400);
    } finally {
      // Nettoyage: suppression du véhicule créé
      if (createdId) {
        await request
          .delete("/api/vehicules", { data: { id: createdId } })
          .then((res) => expect(res.ok()).toBeTruthy())
          .catch(() => {});
        const afterDelete = await prisma.vehicule.findUnique({ where: { id: createdId } });
        expect(afterDelete).toBeNull();
      }
    }
  });
});
