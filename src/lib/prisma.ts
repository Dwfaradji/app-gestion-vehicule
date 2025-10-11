// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client"; // ✅ correct

// Permet de partager l'instance Prisma entre les hot-reloads en dev
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // ou [] si tu ne veux pas logger les requêtes
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
