import { FullConfig, request } from '@playwright/test';
import { prisma } from './utils/prismaClient';
import bcrypt from 'bcryptjs';

// Reset DB and seed deterministic base data for E2E
async function resetDb() {
  // Respect FK order
  await prisma.trajet.deleteMany({});
  await prisma.planification.deleteMany({});
  await prisma.depense.deleteMany({});
  await prisma.vehicule.deleteMany({});
  await prisma.conducteur.deleteMany({});
  await prisma.email.deleteMany({});
  await prisma.horaire.deleteMany({});
  await prisma.vacances.deleteMany({});
  await prisma.section.deleteMany({});
  await prisma.entreprise.deleteMany({});
  await prisma.user.deleteMany({});
}

export default async function globalSetup(config: FullConfig) {
  // Ensure DB connection works
  await prisma.$connect();
  await resetDb();

  // Seed users
  const passwordAdmin = 'Admin!234';
  const passwordUser = 'User!2345';
  const [admin, user] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin Test',
        passwordHash: await bcrypt.hash(passwordAdmin, 10),
        role: 'ADMIN',
        status: 'APPROVED',
        mustChangePassword: false,
      },
    }),
    prisma.user.create({
      data: {
        email: 'user@example.com',
        name: 'User Test',
        passwordHash: await bcrypt.hash(passwordUser, 10),
        role: 'USER',
        status: 'APPROVED',
        mustChangePassword: false,
      },
    }),
  ]);

  // Minimal base entities via Prisma
  const veh = await prisma.vehicule.create({
    data: {
      type: 'Voiture',
      constructeur: 'Peugeot',
      modele: '208',
      km: 12000,
      annee: 2022,
      energie: 'Essence',
      immat: 'E2E-TEST-001',
      statut: 'Disponible',
    },
  });

  const driver = await prisma.conducteur.create({
    data: { nom: 'Doe', prenom: 'John', code: 'DRV-E2E-1' },
  });

  const plan = await prisma.planification.create({
    data: {
      vehiculeId: veh.id,
      conducteurId: driver.id,
      startDate: new Date(Date.now() - 24 * 3600 * 1000),
      endDate: new Date(Date.now() + 24 * 3600 * 1000),
      note: 'Planif seed',
      nbreTranches: 2,
    },
  });

  await prisma.trajet.create({
    data: {
      vehiculeId: veh.id,
      conducteurId: driver.id,
      planificationId: plan.id,
      kmDepart: 10000,
      kmArrivee: 10100,
      heureDepart: '08:00',
      heureArrivee: '09:30',
      destination: 'Paris',
      carburant: 10,
    },
  });

  await prisma.depense.create({
    data: {
      vehiculeId: veh.id,
      categorie: 'MECANIQUE',
      montant: 150,
      km: 12050,
      date: new Date(),
      note: 'Vidange',
      intervenant: 'Garage Test',
    },
  });

  // Optionally warm up server if running
  const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';
  try {
    const api = await request.newContext({ baseURL });
    await api.get('/login');
    await api.dispose();
  } catch {}
}
