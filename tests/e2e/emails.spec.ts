import { test, expect } from '@playwright/test';
import { prisma } from '../utils/prismaClient';
import { login, logout } from '../utils/auth';

// Emails : CRUD via API avec vérifications en base
// Cette suite valide créer/lister/mettre à jour/supprimer des emails avec nettoyage.

test.describe('Emails', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'admin@example.com', 'Admin!234');
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test('créer, lister, modifier et supprimer un email via l’API puis vérifier en base', async ({ request }) => {
    // Utiliser une adresse unique pour éviter les collisions
    const uniqueEmail = `e2e+${Date.now()}@example.com`;

    let createdId: number | null = null;
    try {
      // Création
      const createRes = await request.post('/api/emails', {
        data: { adresse: uniqueEmail },
      });
      expect(createRes.ok()).toBeTruthy();
      const created = await createRes.json();
      createdId = created.id;
      expect(createdId).toBeTruthy();

      // La liste doit contenir l’email créé
      const listRes = await request.get('/api/emails');
      expect(listRes.ok()).toBeTruthy();
      const list = await listRes.json();
      const found = list.find((e: any) => e.id === createdId);
      expect(found).toBeTruthy();

      // Mise à jour de l’adresse
      const updateRes = await request.put(`/api/emails?id=${createdId}`, {
        data: { adresse: `e2e+updated.${Date.now()}@example.com` },
      });
      expect(updateRes.ok()).toBeTruthy();
      const updated = await updateRes.json();
      expect(updated.id).toBe(createdId);
    } finally {
      // Nettoyage — suppression de l’email
      if (createdId) {
        await request
          .delete('/api/emails', { data: { id: createdId } })
          .then(res => expect(res.ok()).toBeTruthy())
          .catch(() => {});
        const after = await prisma.email.findUnique({ where: { id: createdId } });
        expect(after).toBeNull();
      }
    }
  });
});
