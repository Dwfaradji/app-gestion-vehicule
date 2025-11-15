// prisma/seed-full.ts
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seed complet démarré...");

  // -----------------------------
  // Utilisateurs
  // -----------------------------
  const users = [];
  for (let i = 0; i < 3; i++) {
    const password = faker.internet.password();
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        fonction: faker.person.jobTitle(),
        passwordHash: await bcrypt.hash(password, 10),
        role: i === 0 ? "ADMIN" : "USER",
        status: "APPROVED",
      },
    });
    users.push(user);
  }

  // -----------------------------
  // Entreprises
  // -----------------------------
  const entreprises = [];
  for (let i = 0; i < 2; i++) {
    const ent = await prisma.entreprise.create({
      data: {
        nom: faker.company.name(),
        ville: faker.location.city(),
        codePostal: faker.location.zipCode(),
        pays: faker.location.country(),
        email: faker.internet.email(),
        telephone: faker.phone.number(),
        horaire: {
          create: { ouverture: "08:00", fermeture: "18:00" },
        },
      },
    });
    entreprises.push(ent);
  }

  // -----------------------------
  // Sections
  // -----------------------------
  const sections = [];
  for (const ent of entreprises) {
    for (let i = 0; i < 2; i++) {
      const sec = await prisma.section.create({
        data: {
          entrepriseId: ent.id,
          nom: `Section ${i + 1}`,
          ville: faker.location.city(),
          email: faker.internet.email(),
          telephone: faker.phone.number(),
          horaire: { create: { ouverture: "08:00", fermeture: "17:00" } },
        },
      });
      sections.push(sec);
    }
  }

  // -----------------------------
  // Conducteurs
  // -----------------------------
  const conducteurs = [];
  for (let i = 0; i < 5; i++) {
    const cond = await prisma.conducteur.create({
      data: {
        nom: faker.person.lastName(),
        prenom: faker.person.firstName(),
        code: faker.string.alphanumeric(8).toUpperCase(),
      },
    });
    conducteurs.push(cond);
  }

  // -----------------------------
  // Véhicules
  // -----------------------------
  const vehicules = [];
  for (let i = 0; i < 5; i++) {
    const conducteur = faker.helpers.arrayElement(conducteurs);
    const veh = await prisma.vehicule.create({
      data: {
        type: faker.vehicle.type(),
        constructeur: faker.vehicle.manufacturer(),
        modele: faker.vehicle.model(),
        km: faker.number.int({ min: 0, max: 200_000 }),
        annee: faker.date.past({ years: 10 }).getFullYear(),
        energie: faker.helpers.arrayElement(["Essence", "Diesel", "Electrique", "Hybride"]),
        prixAchat: faker.number.int({ min: 5000, max: 80000 }),
        dateEntretien: faker.date.past({ years: 1 }),
        statut: faker.helpers.arrayElement(["Disponible", "Maintenance", "Incident"]),
        prochaineRevision: faker.date.future({ years: 1 }),
        immat: faker.string.alphanumeric({ length: 7 }).toUpperCase(),
        ctValidite: faker.date.future({ years: 2 }),
        vim: faker.string.alphanumeric({ length: 17 }).toUpperCase(),
        places: faker.number.int({ min: 2, max: 9 }),
        motorisation: faker.helpers.arrayElement(["2.0L", "2.5L", "3.0L", "Electrique"]),
        chevauxFiscaux: faker.number.int({ min: 4, max: 20 }),
        rdv: faker.date.soon({ days: 30 }),
        conducteurId: conducteur.id,
      },
    });
    vehicules.push(veh);
  }

  // -----------------------------
  // Planifications
  // -----------------------------
  const planifications = [];
  for (let i = 0; i < 10; i++) {
    const veh = faker.helpers.arrayElement(vehicules);
    const cond = conducteurs.find((c) => c.id === veh.conducteurId)!;

    const start = faker.date.soon({ days: 1 });
    const end = faker.date.soon({ days: 5, refDate: start });

    const planif = await prisma.planification.create({
      data: {
        vehiculeId: veh.id,
        conducteurId: cond.id,
        startDate: start,
        endDate: end,
        type: faker.helpers.arrayElement(["JOUR", "HEBDO", "MENSUEL"]),
        note: faker.lorem.sentence(),
        nbreTranches: faker.number.int({ min: 1, max: 3 }),
      },
    });
    planifications.push(planif);
  }

  // -----------------------------
  // Dépenses
  // -----------------------------
  for (let i = 0; i < 15; i++) {
    const veh = faker.helpers.arrayElement(vehicules);
    await prisma.depense.create({
      data: {
        vehiculeId: veh.id,
        categorie: faker.helpers.arrayElement(["MECANIQUE", "CARROSSERIE", "REVISION"]),
        montant: faker.number.int({ min: 50, max: 2000 }),
        km: faker.number.int({ min: 0, max: 200_000 }),
        date: faker.date.past(),
        note: faker.lorem.sentence(),
        reparation: faker.datatype.boolean() ? faker.lorem.words(2) : null,
        intervenant: faker.person.fullName(),
      },
    });
  }

  // -----------------------------
  // Trajets
  // -----------------------------
  for (const planif of planifications) {
    const nbTrajets = faker.number.int({ min: 1, max: planif.nbreTranches });
    for (let i = 0; i < nbTrajets; i++) {
      const depart = faker.date.between({ from: planif.startDate, to: planif.endDate });
      const arrivee = faker.date.between({ from: depart, to: planif.endDate });
      await prisma.trajet.create({
        data: {
          vehiculeId: planif.vehiculeId,
          conducteurId: planif.conducteurId,
          planificationId: planif.id,
          kmDepart: faker.number.int({ min: 0, max: 50_000 }),
          kmArrivee: faker.number.int({ min: 50_001, max: 200_000 }),
          heureDepart: depart.toTimeString().slice(0, 5),
          heureArrivee: arrivee.toTimeString().slice(0, 5),
          destination: faker.location.city(),
          carburant: faker.number.int({ min: 10, max: 50 }),
          anomalies: "",
        },
      });
    }
  }

  // -----------------------------
  // Emails
  // -----------------------------
  for (let i = 0; i < 10; i++) {
    await prisma.email.create({
      data: { adresse: faker.internet.email() },
    });
  }

  console.log("✅ Seed complet terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
