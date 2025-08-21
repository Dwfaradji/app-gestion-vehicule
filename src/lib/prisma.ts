import { PrismaClient } from "@prisma/client";

declare global {
    // Permet de conserver Prisma dans hot reload (dev)
    var prisma: PrismaClient | undefined;
}

export const prisma =
    global.prisma ||
    new PrismaClient({
        log: ["query"], // optionnel : voir les requêtes SQL
    });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;