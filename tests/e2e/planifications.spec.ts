import { test, expect } from '@playwright/test';
import { prisma } from '../utils/prismaClient';
import { login, logout } from '../utils/auth';

// Planifications : CRUD via API
// Cette suite valide la création, la mise à jour et la suppression des planifications avec relations FK et vérifications en base.

test.describe('Planifications', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'admin@example.com', 'Admin!234');
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test('créer, modifier et supprimer une planification via l’API puis vérifier en base', async ({ request }) => {
    const veh = await prisma.vehicule.findFirstOrThrow();
    const driver = await prisma.conducteur.findFirstOrThrow();

    let createdId: number | null = null;
    try {
      // Créer une planification liée à un véhicule et un conducteur existants
      const createRes = await request.post('/api/planifications', {
        data: {
          vehiculeId: veh.id,
          conducteurId: driver.id,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
          note: 'E2E planif',
          nbreTranches: 1,
        },
      });
      expect(createRes.ok()).toBeTruthy();
      const created = await createRes.json();
      createdId = created.id;
      expect(createdId).toBeTruthy();

      // Mettre à jour le champ note
      const updateRes = await request.put(`/api/planifications/${createdId}` , {
        data: { note: 'E2E planif updated' },
      });
      expect(updateRes.ok()).toBeTruthy();
      const updated = await updateRes.json();
      expect(updated.note).toBe('E2E planif updated');
    } finally {
      // Nettoyage — supprimer la planification créée
      if (createdId) {
        await request
          .delete(`/api/planifications/${createdId}`)
          .then(res => expect(res.ok()).toBeTruthy())
          .catch(() => {});
        const after = await prisma.planification.findUnique({ where: { id: createdId } });
        expect(after).toBeNull();
      }
    }
  });
});
