import { test, expect } from '@playwright/test';
import { prisma } from '../utils/prismaClient';
import { login, logout } from '../utils/auth';

// Conducteurs : CRUD via API avec vérifications en base
// Cette suite vérifie la création, la mise à jour et la suppression des conducteurs, avec nettoyage.

test.describe('Conducteurs', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'admin@example.com', 'Admin!234');
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test('créer, modifier et supprimer un conducteur via l’API puis vérifier en base', async ({ request }) => {
    // Utiliser des noms uniques pour éviter les collisions entre exécutions
    const suffix = Date.now();

    let createdId: number | null = null;
    try {
      // Création via l’API
      const createRes = await request.post('/api/conducteurs', {
        data: { nom: `Chaplin-${suffix}`, prenom: 'Charlie' },
      });
      expect(createRes.ok()).toBeTruthy();
      const created = await createRes.json();
      createdId = created.id;
      expect(createdId).toBeTruthy();
      expect(created.code).toMatch(/[A-Z0-9]{4,}/);

      // Vérification en base
      const inDb = await prisma.conducteur.findUnique({ where: { id: createdId } });
      expect(inDb?.nom).toBe(`Chaplin-${suffix}`);

      // Mise à jour du conducteur
      const updateRes = await request.put('/api/conducteurs', {
        data: { id: createdId, nom: `Chandler-${suffix}`, prenom: 'Charles' },
      });
      expect(updateRes.ok()).toBeTruthy();
      const updated = await updateRes.json();
      expect(updated.nom).toBe(`Chandler-${suffix}`);
    } finally {
      // Nettoyage du conducteur créé
      if (createdId) {
        await request
          .delete('/api/conducteurs', { data: { id: createdId } })
          .then(res => expect(res.ok()).toBeTruthy())
          .catch(() => {});
        const after = await prisma.conducteur.findUnique({ where: { id: createdId } });
        expect(after).toBeNull();
      }
    }
  });
});
