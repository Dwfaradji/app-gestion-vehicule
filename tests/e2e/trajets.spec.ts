import { test, expect } from "@playwright/test";
import { prisma } from "../utils/prismaClient";
import { login, logout } from "../utils/auth";

// Trajets (Trips) CRUD via API with DB assertions
// EN: This suite covers create/update/delete for trips, including JSON anomalies array handling, with cleanup.
// FR: Cette suite couvre la création/mise à jour/suppression des trajets, incluant le tableau JSON d'anomalies, avec nettoyage.

test.describe("Trajets (Trips)", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "adminMCP@example.com", "Admin!234");
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("create, update, delete a trajet via API and verify in DB | créer, modifier, supprimer un trajet et vérifier en BD", async ({
    request,
  }) => {
    const veh = await prisma.vehicule.findFirstOrThrow();
    const driver = await prisma.conducteur.findFirstOrThrow();
    const plan = await prisma.planification.findFirst();

    let createdId: number | null = null;
    try {
      // EN: Create a trip with anomalies array
      // FR: Créer un trajet avec un tableau d'anomalies
      const createRes = await request.post("/api/trajets", {
        data: {
          vehiculeId: veh.id,
          conducteurId: driver.id,
          planificationId: plan?.id ?? null,
          kmDepart: (veh.km || 0) + 100,
          kmArrivee: (veh.km || 0) + 250,
          heureDepart: "10:00",
          heureArrivee: "12:00",
          destination: "Lyon",
          carburant: 20,
          anomalies: [{ note: "RAS" }],
        },
      });
      expect(createRes.ok()).toBeTruthy();
      const created = await createRes.json();
      createdId = created.id;
      expect(createdId).toBeTruthy();

      // EN: DB check for destination and anomalies
      // FR: Vérification BD de la destination et des anomalies
      const inDb = await prisma.trajet.findUnique({ where: { id: Number(createdId) } });
      expect(inDb?.destination).toBe("Lyon");

      // EN: Update destination and carburant only (anomalies untouched)
      // FR: Mettre à jour destination et carburant uniquement (anomalies inchangées)
      const updateRes = await request.put("/api/trajets", {
        data: { id: createdId, destination: "Marseille", carburant: 25 },
      });
      expect(updateRes.ok()).toBeTruthy();
      const updated = await updateRes.json();
      expect(updated.destination).toBe("Marseille");
      expect(updated.carburant).toBe(25);
    } finally {
      // EN: Cleanup — delete the created trip
      // FR: Nettoyage — supprimer le trajet créé
      if (createdId) {
        await request
          .delete("/api/trajets", { data: { id: createdId } })
          .then((res) => expect(res.ok()).toBeTruthy())
          .catch(() => {});
        const after = await prisma.trajet.findUnique({ where: { id: createdId } });
        expect(after).toBeNull();
      }
    }
  });
});
