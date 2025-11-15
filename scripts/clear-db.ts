// prisma/clear-db.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("⚠️  Début de la purge de toutes les tables...");

  // ⚡ Supprimer dans l'ordre pour respecter les relations
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

  console.log("✅ Toutes les tables ont été vidées !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
