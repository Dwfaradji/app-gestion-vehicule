import { test, expect } from '@playwright/test';
import { prisma } from '../utils/prismaClient';
import { login, logout } from '../utils/auth';

// Dépenses : CRUD basique via API avec vérifications en base
// Cette suite crée et supprime une dépense pour un véhicule, avec nettoyage.

test.describe('Dépenses', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'admin@example.com', 'Admin!234');
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test('créer puis supprimer une dépense via l’API et vérifier en base', async ({ request }) => {
    const veh = await prisma.vehicule.findFirstOrThrow();

    // Utiliser une note unique pour éviter toute collision
    const note = `E2E dépense ${Date.now()}`;

    let createdId: number | null = null;
    try {
      // Création
      const createRes = await request.post('/api/depenses', {
        data: {
          vehiculeId: veh.id,
          categorie: 'MECANIQUE',
          montant: 199,
          km: (veh.km || 0) + 10,
          date: new Date().toISOString(),
          note,
          intervenant: 'Test Garage',
        },
      });
      expect(createRes.ok()).toBeTruthy();
      const created = await createRes.json();
      createdId = created.id;
      expect(createdId).toBeTruthy();

      // Vérifier en base
      const inDb = await prisma.depense.findUnique({ where: { id: createdId } });
      expect(inDb?.note).toBe(note);
    } finally {
      // Nettoyage — suppression de la dépense (l’API nécessite vehiculeId)
      if (createdId) {
        await request
          .delete('/api/depenses', { data: { id: createdId, vehiculeId: veh.id } })
          .then(res => expect(res.ok()).toBeTruthy())
          .catch(() => {});
        const after = await prisma.depense.findUnique({ where: { id: createdId } });
        expect(after).toBeNull();
      }
    }
  });
});
