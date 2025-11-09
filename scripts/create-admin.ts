import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.USER_ADMIN || !process.env.MDP_ADMIN) {
    throw new Error("Veuillez définir USER_ADMIN et MDP_ADMIN dans le .env");
  }

  const hashed = await bcrypt.hash(process.env.MDP_ADMIN, 10);

  await prisma.user.upsert({
    where: { email: process.env.USER_ADMIN },
    update: {}, // ne rien modifier si déjà existant
    create: {
      email: process.env.USER_ADMIN,
      passwordHash: hashed,
      role: "ADMIN",
      mustChangePassword: true, // première connexion
      status: "APPROVED",
    },
  });

  console.warn("Admin créé");
}

main()
  .catch((e) => {
    console.error("Erreur lors de la création de l’admin :", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
